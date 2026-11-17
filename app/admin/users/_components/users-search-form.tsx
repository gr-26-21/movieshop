import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// A component for displaying a search form for users
export default function UsersSearchForm({ search }: { search?: string }) {
  return (
    <>
      <form action="/admin/users">
        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <Input
            className="w-full px-5 sm:flex-1"
            name="search"
            defaultValue={search}
            placeholder="Search by name"
          />
          <Button type="submit" className="w-full sm:w-auto">
            Search User
          </Button>
        </div>
      </form>
    </>
  );
}
