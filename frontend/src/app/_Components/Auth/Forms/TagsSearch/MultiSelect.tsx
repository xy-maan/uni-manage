"use client"
import { SearchTagsAction } from '@/Actions/SearchTags.action';
import { Badge } from '@/components/ui/badge';
import { TagsOptionsPayload } from '@/types/skills';
import React, { useState } from 'react'
import { MultiValue } from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import { PopularTags } from './PopularTags';

export type tagsOption = {
  value: number | string;
  label: string;
  is_official?: boolean;
};

type tagsSelectProps = {
  value: (number | string)[];
  onChange: (values: (number | string)[]) => void;
  isInvalid?: boolean;
  onBlur?: () => void;
  variant:string
};

// const popularSkills = [
//   { value: "React", label: "React" },
//   { value: "Python", label: "Python" },
//   { value: "JavaScript", label: "JavaScript" },
//   { value: "TypeScript", label: "TypeScript" },
//   { value: "Node.js", label: "Node.js" },
//   { value: "Java", label: "Java" },
//   { value: "C++", label: "C++" },
//   { value: "SQL", label: "SQL" },
//   { value: "MongoDB", label: "MongoDB" },
//   { value: "AWS", label: "AWS" },
//   { value: "Machine Learning", label: "Machine Learning" },
//   { value: "Data Analysis", label: "Data Analysis" },
//   { value: "UI/UX Design", label: "UI/UX Design" },
//   { value: "Mobile Development", label: "Mobile Development" },
// ];

export default function MultiSelect({ value, onChange, isInvalid, onBlur,variant }: tagsSelectProps) {
  // user selected values ===> selectedOptions
  const [selectedOptions, setSelectedOptions] = useState<tagsOption[]>([]);

  async function searchOptions(queryValue: string) {
    const { payload } = await SearchTagsAction(queryValue);
    return payload.map((Tag: TagsOptionsPayload) => ({
      value: Tag.id,
      label: Tag.name,
    }));
  }

  // function addPopularTags(tagPopular: { value: string, label: string }) {
  //   // عشان مكررش نفس ال skills
  //   const alreadySelected = selectedOptions.some(selectedUser => selectedUser.label.toLowerCase() === tagPopular.label.toLowerCase());
  //   if (alreadySelected) return;

  //   const newOption: tagsOption = { value: tagPopular.value, label: tagPopular.label };
  //   const updatedTags = [...selectedOptions, newOption];
  //   setSelectedOptions(updatedTags);
  //   // للباك
  //   onChange(updatedTags.map(item => item.is_official ? item.label : item.value));
  // }
// function handleTogglePopularTags(tagPopular:{value: string, label: string }) {
//   const isSelected = selectedOptions.some(
//     (selectedUser) => selectedUser.label.toLowerCase() === tagPopular.label.toLowerCase()
//   );

//   if (isSelected) {
//     const updated = selectedOptions.filter(
//       (selectedUser) => selectedUser.label.toLowerCase() !== tagPopular.label.toLowerCase()
//     );
//     setSelectedOptions(updated);
//     onChange(
//       updated.map((item) =>
//         item.is_official ? item.value : item.label
//       )
//     );
//   } else {
//     addPopularTags(tagPopular);
//   }
// }

  return (
    <div className="space-y-3">
      <AsyncCreatableSelect
        controlShouldRenderValue={false}
        onBlur={onBlur}
        loadOptions={searchOptions}
        value={selectedOptions}
        onChange={(selected: MultiValue<tagsOption>) => {
          setSelectedOptions(selected as tagsOption[]);
          const values = selected.map(item => item.is_official ? item.label : item.value);
          onChange(values);
        }}
        classNamePrefix="react-select"
        classNames={{
          control: () => `!border-border !rounded-md dark:!bg-input/30 bg-transparent border-input w-full rounded-md border !text-sm shadow-xs ${isInvalid ? "!border-destructive" : ""}`,
          option: () => "!text-foreground !bg-input/30 !text-sm",
          menu: () => "!bg-input border-border text-foreground!",
        }}
        isMulti
        placeholder={`${variant=="student"?"Type a Tag and press Enter...":"Type an area and press Enter"} `}
        formatCreateLabel={(input) => `Add "${input}"`}
        noOptionsMessage={({ inputValue }) => inputValue ? "No skills found" : "Type to search..."}
      />

     
      {/* <div>
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
      </div> */}

      <PopularTags
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        onChange={onChange}
      />

{/* {selectedOptions.length > 0 && (
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
)} */}
    </div>
  );
}
