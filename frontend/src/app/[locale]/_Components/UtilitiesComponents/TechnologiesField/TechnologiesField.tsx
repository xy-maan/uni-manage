"use client"
import { SearchTagsAction } from '@/Actions/SearchTags.action';
import { Badge } from '@/components/ui/badge';
import { OptionsPayload } from '@/types/skills';
import React, { useState } from 'react'
import { MultiValue } from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import { GetTagsAction } from '@/Actions/getTags.action';
import { SearchTechnologyAction } from '@/Actions/searchTechnology.action';

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


export default function TechnologiesField({ value, onChange, isInvalid, onBlur,variant }: tagsSelectProps) {
  // user selected values ===> selectedOptions
  const [selectedOptions, setSelectedOptions] = useState<tagsOption[]>([]);
  async function searchTechnology(queryValue: string) {
    const { payload } = await SearchTechnologyAction(queryValue);
    return payload.map((Tag: OptionsPayload) => ({
      value: Tag.id,
      label: Tag.name,
    }));
  }


  return (
    <div className="space-y-3">
      <AsyncCreatableSelect
        controlShouldRenderValue={false}
        onBlur={onBlur}
        loadOptions={searchTechnology}
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
        placeholder="Add technology (e.g., React, Python)..."
        formatCreateLabel={(input) => `Add "${input}"`}
        noOptionsMessage={({ inputValue }) => inputValue ? "No skills found" : "Type to search..."}
      />
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
