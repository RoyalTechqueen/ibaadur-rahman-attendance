interface StudentFiltersProps {
  gender: string;
  status: string;
  onGenderChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const StudentFilters = ({
  gender,
  status,
  onGenderChange,
  onStatusChange,
}: StudentFiltersProps) => {
  return (
    <div className="flex gap-3">
      <select
        value={gender}
        onChange={(e) => onGenderChange(e.target.value)}
        className="rounded-xl border px-4 py-3"
      >
        <option value="">All Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-xl border px-4 py-3"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
};

export default StudentFilters;