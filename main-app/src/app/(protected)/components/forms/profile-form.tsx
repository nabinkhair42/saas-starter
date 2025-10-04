'use client';

import DashboardSkeleton from '@/app/(protected)/components/dashboard-skeleton';
import { UploadAvatar } from '@/app/(protected)/components/upload-avatar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useProfileForm } from '@/hooks/users/use-profile-form';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Check,
  ChevronDown,
  Loader2,
  MapPin,
  RotateCcw,
  Trash2,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { FaGlobe } from 'react-icons/fa6';
import { SOCIAL_PLATFORMS } from './constants';

// Integrated Social Input Component
function SocialInput({
  provider,
  url,
  onProviderChange,
  onUrlChange,
  placeholder = 'https://example.com',
}: {
  provider: string;
  url: string;
  onProviderChange: (provider: string) => void;
  onUrlChange: (url: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selectedPlatform = SOCIAL_PLATFORMS[provider as keyof typeof SOCIAL_PLATFORMS];
  const Icon = selectedPlatform?.icon || FaGlobe;
  const dynamicPlaceholder = selectedPlatform?.placeholder || placeholder;

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex w-full items-center justify-between gap-3 sm:w-48"
          >
            <span className="flex flex-1 items-center gap-2 truncate">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="truncate text-sm">
                {selectedPlatform?.label ?? 'Select platform'}
              </span>
            </span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[260px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search platforms..." className="h-9" />
            <CommandEmpty>No platform found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="max-h-60">
                <div className="py-1">
                  {Object.entries(SOCIAL_PLATFORMS).map(([key, { icon: PlatformIcon, label }]) => {
                    const isSelected = provider === key;
                    return (
                      <CommandItem
                        key={key}
                        value={`${label} ${key}`}
                        onSelect={() => {
                          onProviderChange(key);
                          setOpen(false);
                        }}
                      >
                        <PlatformIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1 text-sm">{label}</span>
                        {isSelected && <Check className="h-4 w-4 text-primary" />}
                      </CommandItem>
                    );
                  })}
                </div>
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <Input
        value={url}
        onChange={e => onUrlChange(e.target.value)}
        placeholder={dynamicPlaceholder}
        className="sm:flex-1"
      />
    </div>
  );
}

export function ProfileForm() {
  const {
    form,
    fields,
    append,
    remove,
    handleSubmit,
    isLoading,
    isSubmitDisabled,
    isUpdating,
    usernameValue,
    usernameAvailable,
    checkingUsername,
    handleUsernameChange,
    hasChangedUsername,
    user,
  } = useProfileForm();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <div className="w-full max-w-md">
        <h3 className="font-medium">Profile Settings</h3>
        <p className="text-muted-foreground text-sm">
          Update your personal information and manage your profile details.
        </p>
      </div>
      <div className="space-y-6 w-full">
        <UploadAvatar />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your first name. It will be displayed on your profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your last name. It will be displayed on your profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="shadcn"
                          {...field}
                          disabled={hasChangedUsername}
                          onChange={e => {
                            field.onChange(e);
                            handleUsernameChange(e);
                          }}
                        />
                        {!hasChangedUsername &&
                          usernameValue &&
                          usernameValue !== user?.username && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              {checkingUsername ? (
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                              ) : usernameAvailable === true ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : usernameAvailable === false ? (
                                <XCircle className="h-4 w-4 text-red-500" />
                              ) : null}
                            </div>
                          )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      {hasChangedUsername ? (
                        <span className="text-muted-foreground">
                          Username can only be changed once. You have already updated your username.
                        </span>
                      ) : (
                        <span className="text-warning">
                          You can change your username only once. Choose carefully.
                        </span>
                      )}
                    </FormDescription>
                    {!hasChangedUsername && usernameValue && usernameValue !== user?.username && (
                      <div className="text-sm">
                        {checkingUsername ? (
                          <span className="text-muted-foreground">Checking availability...</span>
                        ) : usernameAvailable === true ? (
                          <span className="text-green-600">✓ Username is available</span>
                        ) : usernameAvailable === false ? (
                          <span className="text-red-600">✗ Username is already taken</span>
                        ) : null}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={date => date > new Date() || date < new Date('1900-01-01')}
                          captionLayout="dropdown"
                          formatters={{
                            formatMonthDropdown: date =>
                              date.toLocaleString('default', { month: 'long' }),
                            formatYearDropdown: date => date.getFullYear().toString(),
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Your date of birth helps us personalize your experience. You can quickly
                      select year and month using the dropdowns.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your bio. It will be displayed on your profile.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <h4 className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-muted-foreground" /> Location
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Share where you&apos;re based. Leave any field blank to keep it hidden.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    form.resetField('location', {
                      defaultValue: {
                        address: '',
                        city: '',
                        state: '',
                        country: '',
                        zipCode: '',
                      },
                      keepDirty: false,
                      keepTouched: false,
                    })
                  }
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Clear fields
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="location.address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Street address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="San Francisco" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State / Region</FormLabel>
                      <FormControl>
                        <Input placeholder="California" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location.zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP / Postal code</FormLabel>
                      <FormControl>
                        <Input placeholder="94103" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="United States" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <FormLabel>Social Accounts</FormLabel>
                <FormDescription>
                  Add links to your website, blog, or social media profiles.
                </FormDescription>
              </div>
              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  You haven&apos;t added any accounts yet.
                </p>
              )}
              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <SocialInput
                    provider={form.watch(`socialAccounts.${index}.provider`) || 'website'}
                    url={form.watch(`socialAccounts.${index}.url`) || ''}
                    onProviderChange={provider => {
                      form.setValue(`socialAccounts.${index}.provider`, provider, {
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                    }}
                    onUrlChange={url => {
                      form.setValue(`socialAccounts.${index}.url`, url, {
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    className="h-9 w-9 self-start sm:self-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ provider: 'website', url: '' })}
              >
                Add Social Account
              </Button>
            </div>

            <Button
              type="submit"
              disabled={isSubmitDisabled}
              loading={isUpdating}
              loadingText="Updating"
            >
              Update Profile
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
