import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useDebounce } from '@/hooks/ui/use-debounce';
import {
  useChangeUsername,
  useUpdateUserDetails,
  useUserDetails,
} from '@/hooks/users/use-user-mutations';
import { userService } from '@/services/user-service';
import { UpdateUserDetailsRequest } from '@/types/api';
import { profileFormInputSchema } from '@/zod/usersUpdate';

type ProfileFormValues = z.infer<typeof profileFormInputSchema>;
type ProfileFormLocation = NonNullable<ProfileFormValues['location']>;

const EMPTY_LOCATION: ProfileFormLocation = {
  address: '',
  city: '',
  state: '',
  country: '',
  zipCode: '',
};

const locationFromUser = (
  location: Partial<ProfileFormLocation> | null | undefined
): ProfileFormLocation => ({
  address: location?.address ?? '',
  city: location?.city ?? '',
  state: location?.state ?? '',
  country: location?.country ?? '',
  zipCode: location?.zipCode ?? '',
});

const normalizeLocation = (
  location: Partial<ProfileFormLocation> | null | undefined
): ProfileFormLocation | null => {
  if (!location) {
    return null;
  }

  const trimmed: ProfileFormLocation = {
    address: location.address?.trim() ?? '',
    city: location.city?.trim() ?? '',
    state: location.state?.trim() ?? '',
    country: location.country?.trim() ?? '',
    zipCode: location.zipCode?.trim() ?? '',
  };

  const hasValues = Object.values(trimmed).some(value => value.length > 0);

  return hasValues ? trimmed : null;
};

const locationsAreEqual = (
  first: ProfileFormLocation | null,
  second: ProfileFormLocation | null
) => {
  if (!first && !second) return true;
  if (!first || !second) return false;

  return (
    first.address === second.address &&
    first.city === second.city &&
    first.state === second.state &&
    first.country === second.country &&
    first.zipCode === second.zipCode
  );
};

export function useProfileForm() {
  const { data: userDetails, isLoading } = useUserDetails();
  const updateUserDetails = useUpdateUserDetails();
  const changeUsername = useChangeUsername();

  const [usernameValue, setUsernameValue] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const debouncedUsername = useDebounce(usernameValue, 500);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormInputSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      bio: '',
      socialAccounts: [],
      dob: undefined,
      location: { ...EMPTY_LOCATION },
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'socialAccounts',
    control: form.control,
  });

  // Update form when user details are loaded
  useEffect(() => {
    if (userDetails?.data?.user) {
      const user = userDetails.data.user;
      const initialUsername = user.username || '';
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: initialUsername,
        bio: user.bio || '',
        socialAccounts:
          user.socialAccounts?.map(account => ({
            provider: account.provider || 'website',
            url: account.url,
          })) || [],
        dob: user.dob ? new Date(user.dob) : undefined,
        location: locationFromUser(user.location),
      });
      setUsernameValue(initialUsername);
    }
  }, [userDetails, form]);

  // Check username availability when debounced value changes
  useEffect(() => {
    const user = userDetails?.data?.user;

    if (!debouncedUsername || !user) {
      setCheckingUsername(false);
      setUsernameAvailable(null);
      return;
    }

    const currentUsername = user.username;
    const hasChangedUsername = user.hasChangedUsername;

    // Skip checks if username matches current value or has already been changed once
    if (debouncedUsername === currentUsername || hasChangedUsername) {
      setCheckingUsername(false);
      setUsernameAvailable(null);
      return;
    }

    // Require minimum length before triggering API call
    if (debouncedUsername.length < 3) {
      setCheckingUsername(false);
      setUsernameAvailable(null);
      return;
    }

    let isCancelled = false;
    setCheckingUsername(true);
    setUsernameAvailable(null);

    const checkAvailability = async () => {
      try {
        await userService.checkUsernameAvailability(debouncedUsername);
        if (!isCancelled) {
          setUsernameAvailable(true);
        }
      } catch {
        if (!isCancelled) {
          setUsernameAvailable(false);
        }
      } finally {
        if (!isCancelled) {
          setCheckingUsername(false);
        }
      }
    };

    checkAvailability();

    return () => {
      isCancelled = true;
    };
  }, [debouncedUsername, userDetails]);

  const updateOtherDetails = (data: ProfileFormValues) => {
    // Transform social accounts to the expected format
    const socialAccounts =
      data.socialAccounts?.map(account => ({
        url: account.url,
        provider: account.provider,
      })) || [];

    const user = userDetails?.data?.user;
    const nextLocation = normalizeLocation(data.location);
    const currentLocation = normalizeLocation(locationFromUser(user?.location));
    const locationHasChanged = !locationsAreEqual(nextLocation, currentLocation);

    const payload: UpdateUserDetailsRequest = {
      firstName: data.firstName,
      lastName: data.lastName,
      bio: data.bio,
      socialAccounts,
      dob: data.dob,
    };

    if (locationHasChanged) {
      payload.location = nextLocation;
    }

    updateUserDetails.mutate(payload);
  };

  const handleSubmit = (data: ProfileFormValues) => {
    const user = userDetails?.data?.user;
    if (!user) return;

    // Check if username has changed and user hasn't already changed it
    const usernameChanged = data.username !== user.username;
    const canChangeUsername = !user.hasChangedUsername;

    if (usernameChanged && canChangeUsername) {
      // Change username first, then update other details
      changeUsername.mutate(
        { username: data.username },
        {
          onSuccess: () => {
            // After username change, update other details
            updateOtherDetails(data);
          },
        }
      );
    } else {
      // Just update other details
      updateOtherDetails(data);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameValue(e.target.value);
  };

  const user = userDetails?.data?.user;
  const hasChangedUsername = user?.hasChangedUsername || false;
  const isSubmitDisabled =
    updateUserDetails.isPending ||
    changeUsername.isPending ||
    (!hasChangedUsername && usernameValue !== user?.username && usernameAvailable === false);

  return {
    // Form controls
    form,
    fields,
    append,
    remove,
    handleSubmit,

    // Loading states
    isLoading,
    isSubmitDisabled,
    isUpdating: updateUserDetails.isPending || changeUsername.isPending,

    // Username availability
    usernameValue,
    usernameAvailable,
    checkingUsername,
    handleUsernameChange,
    hasChangedUsername,

    // User data
    user,
  };
}
