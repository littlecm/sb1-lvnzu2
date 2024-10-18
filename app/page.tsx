import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Vehicle Inventory Feed Manager</h1>
      <div className="space-y-4">
        <Link href="/groups">
          <Button>Manage Groups</Button>
        </Link>
        <Link href="/channels">
          <Button>Manage Channels</Button>
        </Link>
      </div>
    </div>
  );
}