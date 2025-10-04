import { Button } from '@/components/ui/button';
import { SiGithub } from 'react-icons/si';

export async function StarsCount() {
  const data = await fetch('https://api.github.com/repos/nabinkhair42/fastly', {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },

    next: { revalidate: 86400 },
  });
  const json = await data.json();

  return (
    <div className="text-xs flex items-center justify-center">
      <p> {json.stargazers_count}</p>
    </div>
  );
}

export const GitHubButton = () => {
  return (
    <>
      <Button
        variant={'outline'}
        size="sm"
        className="rounded-full flex gap-[8px] w-fit sm:inline-flex shadow-none"
      >
        <SiGithub />
        <StarsCount />
      </Button>
    </>
  );
};
