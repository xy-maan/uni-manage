"use client"
import { SearchTagsAction } from '@/Actions/SearchTags.action';
import { Badge } from '@/components/ui/badge';
import { OptionsPayload } from '@/types/skills';
import React, { useState } from 'react'
import { MultiValue } from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import { PopularTags } from './PopularTags';
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


export default function MultiSelect({ value, onChange, isInvalid, onBlur,variant }: tagsSelectProps) {
  // user selected values ===> selectedOptions
  const [selectedOptions, setSelectedOptions] = useState<tagsOption[]>([]);
  async function searchOptions(queryValue: string) {
    const { payload } = await SearchTagsAction(queryValue);
    return payload.map((Tag: OptionsPayload) => ({
      value: Tag.id,
      label: Tag.name,
    }));
  }
  async function searchTechnology(queryValue: string) {
    const { payload } = await SearchTechnologyAction(queryValue);
    return payload.map((Tag: OptionsPayload) => ({
      value: Tag.id,
      label: Tag.name,
    }));
  }
async function searchHandle(queryValue: string){
  if(variant=="project"){
return  searchTechnology(queryValue)
  }
  else{
  return   searchOptions(queryValue)
  }
}

  return (
    <div className="space-y-3">
      <AsyncCreatableSelect
        controlShouldRenderValue={false}
        onBlur={onBlur}
        loadOptions={searchHandle}
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


      <PopularTags
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        onChange={onChange}
      />

    </div>
  );
}
