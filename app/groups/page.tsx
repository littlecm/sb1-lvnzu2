"use client"

import { useState } from 'react';
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
  csvData?: any[];
}

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroup, setNewGroup] = useState<Group>({ 
    name: '', 
    csvInput: '', 
    updateTimes: [], 
    rules: '', 
    csvData: [] 
  });

  const updateTimeOptions = Array.from({ length: 24 }, (_, i) => 
    `${String(i).padStart(2, '0')}:00`
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewGroup({ ...newGroup, [name]: value });
  };

  const handleUpdateTimeChange = (value: string) => {
    setNewGroup({ ...newGroup, updateTimes: [...newGroup.updateTimes, value] });
  };

  const removeUpdateTime = (time: string) => {
    setNewGroup({ 
      ...newGroup, 
      updateTimes: newGroup.updateTimes.filter(t => t !== time) 
    });
  };

  const fetchCsvData = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV data from ${url}`);
      }
      const csvText = await response.text();
      const parsedData = Papa.parse(csvText, { header: true });
      return parsedData.data;
    } catch (error) {
      console.error('Error fetching or parsing CSV:', error);
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Fetch and parse the CSV data
    const csvData = await fetchCsvData(newGroup.csvInput);
    
    // Add the new group with the parsed CSV data
    setGroups([...groups, { ...newGroup, csvData }]);
    
    // Reset the newGroup state
    setNewGroup({ name: '', csvInput: '', updateTimes: [], rules: '', csvData: [] });
    
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
          <Select onValueChange={handleUpdateTimeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select update times" />
            </SelectTrigger>
            <SelectContent>
              {updateTimeOptions.map((time) => (
                <SelectItem key={time} value={time}>{time}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-2 flex flex-wrap gap-2">
            {newGroup.updateTimes.map((time) => (
              <div key={time} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center">
                {time}
                <button 
                  type="button" 
                  onClick={() => removeUpdateTime(time)}
                  className="ml-2 text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
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
      <div>
        <h2 className="text-2xl font-bold mb-4">Existing Groups</h2>
        {groups.map((group, index) => (
          <div key={index} className="bg-secondary p-4 rounded-lg mb-4">
            <h3 className="text-xl font-semibold">{group.name}</h3>
            <p>CSV Input: {group.csvInput}</p>
            <p>Update Times: {group.updateTimes.join(', ')}</p>
            <p>Rules: {group.rules}</p>
            <p>CSV Data Sample: {JSON.stringify(group.csvData?.[0] || {}, null, 2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
