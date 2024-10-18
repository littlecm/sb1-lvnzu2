"use client"

import { useState, createContext, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Papa from 'papaparse';

interface Group {
  name: string;
  csvInput: string;
  updateTimes: string[];
  rules: string;
  fields: string[];
}

interface GroupsContextType {
  groups: Group[];
  addGroup: (group: Group) => void;
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export const useGroups = () => {
  const context = useContext(GroupsContext);
  if (!context) {
    throw new Error("useGroups must be used within a GroupsProvider");
  }
  return context;
};

export function GroupsProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([]);

  const addGroup = (group: Group) => {
    setGroups([...groups, group]);
  };

  return (
    <GroupsContext.Provider value={{ groups, addGroup }}>
      {children}
    </GroupsContext.Provider>
  );
}

export default function Groups() {
  const { addGroup } = useGroups();
  const [newGroup, setNewGroup] = useState<Group>({ 
    name: '', 
    csvInput: '', 
    updateTimes: [], 
    rules: '', 
    fields: [] 
  });

  const updateTimeOptions = Array.from({ length: 24 }, (_, i) => 
    `${String(i).padStart(2, '0')}:00`
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewGroup({ ...newGroup, [name]: value });
  };

  const fetchCsvFields = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV data from ${url}`);
      }
      const csvText = await response.text();
      const parsedData = Papa.parse(csvText, { header: true });
      return Object.keys(parsedData.data[0] || {});
    } catch (error) {
      console.error('Error fetching or parsing CSV:', error);
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Fetch and parse CSV data to get field names
    const fields = await fetchCsvFields(newGroup.csvInput);
    
    // Add the new group
    addGroup({ ...newGroup, fields });

    // Reset form
    setNewGroup({ name: '', csvInput: '', updateTimes: [], rules: '', fields: [] });
    console.log(`Group ${newGroup.name} has been added successfully.`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Manage Groups</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <Label htmlFor="name">Group Name</Label>
          <Input
            id="name"
            name="name"
            value={newGroup.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="csvInput">CSV Input Feed URL</Label>
          <Input
            id="csvInput"
            name="csvInput"
            value={newGroup.csvInput}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label>Update Times</Label>
          <Select onValueChange={(value) => setNewGroup({ ...newGroup, updateTimes: [...newGroup.updateTimes, value] })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select update times" />
            </SelectTrigger>
            <SelectContent>
              {updateTimeOptions.map((time) => (
                <SelectItem key={time} value={time}>{time}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="rules">Rules</Label>
          <Textarea
            id="rules"
            name="rules"
            value={newGroup.rules}
            onChange={handleInputChange}
            placeholder="Enter rules for processing the CSV data"
          />
        </div>
        <Button type="submit">Add Group</Button>
      </form>
    </div>
  );
}
