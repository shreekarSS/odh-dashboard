import * as React from 'react';
import { Select, SelectOption, Stack, StackItem } from '@patternfly/react-core';
import IndentSection from '../../../components/IndentSection';

type EnvDataTypeFieldProps = {
  options: { [optionLabel: string]: React.ReactNode };
  selection: string;
  onSelection: (value: string) => void;
};

const EnvDataTypeField: React.FC<EnvDataTypeFieldProps> = ({ options, onSelection, selection }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Stack hasGutter>
      <StackItem>
        <Select
          isOpen={open}
          onToggle={() => setOpen(!open)}
          selections={selection}
          placeholderText="Select one"
          onSelect={(e, value) => {
            if (typeof value === 'string') {
              onSelection(value);
              setOpen(false);
            }
          }}
        >
          {Object.keys(options).map((option) => (
            <SelectOption key={option} value={option}>
              {option}
            </SelectOption>
          ))}
        </Select>
      </StackItem>
      {selection && (
        <StackItem>
          <IndentSection>{options[selection]}</IndentSection>
        </StackItem>
      )}
    </Stack>
  );
};

export default EnvDataTypeField;
