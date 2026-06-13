import { Badge } from "@/components/ui/badge";
import { tagsOption } from "./MultiSelect";
type tagsSelectProps = {
  selectedOptions:tagsOption[];
  onChange: (values: (number | string)[]) => void;
  setSelectedOptions: React.Dispatch<React.SetStateAction<tagsOption[]>>;

};
export function PopularTags({
  selectedOptions,
  setSelectedOptions,
  onChange,
}:tagsSelectProps) {
const popularSkills = [
  { value: "React", label: "React" },
  { value: "Python", label: "Python" },
  { value: "JavaScript", label: "JavaScript" },
  { value: "TypeScript", label: "TypeScript" },
  { value: "Node.js", label: "Node.js" },
  { value: "Java", label: "Java" },
  { value: "C++", label: "C++" },
  { value: "SQL", label: "SQL" },
  { value: "MongoDB", label: "MongoDB" },
  { value: "AWS", label: "AWS" },
  { value: "Machine Learning", label: "Machine Learning" },
  { value: "Data Analysis", label: "Data Analysis" },
  { value: "UI/UX Design", label: "UI/UX Design" },
  { value: "Mobile Development", label: "Mobile Development" },
];

function handleTogglePopularTags(tagPopular:{value: string, label: string }) {
  const isSelected = selectedOptions.some(
    (selectedUser) => selectedUser.label.toLowerCase() === tagPopular.label.toLowerCase()
  );

  if (isSelected) {
    const updated = selectedOptions.filter(
      (selectedUser) => selectedUser.label.toLowerCase() !== tagPopular.label.toLowerCase()
    );
    setSelectedOptions(updated);
    onChange(
      updated.map((item) =>
        item.is_official ? item.value : item.label
      )
    );
  } else {
    addPopularTags(tagPopular);
  }
}
  function addPopularTags(tagPopular: { value: string, label: string }) {
    // عشان مكررش نفس ال skills
    const alreadySelected = selectedOptions.some(selectedUser => selectedUser.label.toLowerCase() === tagPopular.label.toLowerCase());
    if (alreadySelected) return;

    const newOption: tagsOption = { value: tagPopular.value, label: tagPopular.label };
    const updatedTags = [...selectedOptions, newOption];
    setSelectedOptions(updatedTags);
    // للباك
    onChange(updatedTags.map(item => item.is_official ? item.label : item.value));
  }

  return (
     <div>
    <div className=" mb-3">
            <p className="text-xs text-muted-foreground mb-2">Popular skills:</p>
        <div className="flex flex-wrap gap-2">
          {popularSkills.map(tagPopular => {
            const isSelected = selectedOptions.some(selectedUser => selectedUser.label.toLowerCase() === tagPopular.label.toLowerCase());
            return (
              <Badge
                key={tagPopular.value}
               onClick={() => {
    handleTogglePopularTags(tagPopular)

  }}
                className={`text-xs font-medium border-border border cursor-pointer
                  ${isSelected
                    ? ""
                    : "  bg-transparent"
                  }`}
              >
                {tagPopular.label}
              </Badge>
            );
          })}
        </div>
    </div>
    {selectedOptions.length > 0 && (
  <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
    <p className="text-sm font-medium mb-2">Selected ({selectedOptions.length}):</p>
    <div className="flex flex-wrap gap-2">
      {selectedOptions.map((tag, i) => (
        <Badge key={i} className=" bg-secondary text-secondary-foreground text-xs">
          {tag.label}
          <button
            type="button"
            onClick={() => {
              const updated = selectedOptions.filter((element, index) => index !== i);
              setSelectedOptions(updated);
              onChange(updated.map(item => item.is_official ? item.label : item.value));
            }}
            className="cursor-pointer ml-1 hover:text-destructive"
          >
            ×
          </button>
        </Badge>
      ))}
    </div>
  </div>
)}
      </div>

  );
}