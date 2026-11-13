import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// A component for displaying a search form for users
export default function UsersSearchForm({ search }: { search?: string }) {
  return (
    <>
      <form action="/admin/users">
        <div className="flex gap-2">
          <Input
            className="px-5"
            name="search"
            defaultValue={search}
            placeholder="Search by name"
          />
          <Button type="submit">Search User</Button>
        </div>
      </form>
    </>
  );
}
