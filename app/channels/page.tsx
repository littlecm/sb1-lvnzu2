"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, Trash2 } from 'lucide-react';

interface Field {
  name: string;
  sourceField: string;
  rule: string;
}

interface Channel {
  name: string;
  group: string;
  fields: Field[];
}

export default function Channels() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [newChannel, setNewChannel] = useState<Channel>({ 
    name: '', 
    group: '', 
    fields: [{ name: '', sourceField: '', rule: '' }] 
  });
  const { toast } = useToast()

  // Mock groups data (replace with actual data in a real application)
  const groups = ['Group 1', 'Group 2', 'Group 3'];

  // Mock source fields (replace with actual fields from the selected group's CSV)
  const sourceFields = ['VIN', 'Make', 'Model', 'Year', 'Price', 'Color'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewChannel({ ...newChannel, [name]: value });
  };

  const handleGroupSelect = (value: string) => {
    setNewChannel({ ...newChannel, group: value });
  };

  const handleFieldChange = (index: number, field: keyof Field, value: string) => {
    const updatedFields = newChannel.fields.map((f, i) => 
      i === index ? { ...f, [field]: value } : f
    );
    setNewChannel({ ...newChannel, fields: updatedFields });
  };

  const addField = () => {
    setNewChannel({
      ...newChannel,
      fields: [...newChannel.fields, { name: '', sourceField: '', rule: '' }]
    });
  };

  const removeField = (index: number) => {
    const updatedFields = newChannel.fields.filter((_, i) => i !== index);
    setNewChannel({ ...newChannel, fields: updatedFields });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChannels([...channels, newChannel]);
    setNewChannel({ name: '', group: '', fields: [{ name: '', sourceField: '', rule: '' }] });
    toast({
      title: "Channel added",
      description: `${newChannel.name} has been added successfully.`,
    })
  };

  const handleDownload = (channelName: string) => {
    // In a real application, this would generate and download the CSV file
    toast({
      title: "Download started",
      description: `Downloading ${channelName}.csv`,
    })
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Manage Channels</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <Label htmlFor="name">Channel Name</Label>
          <Input
            id="name"
            name="name"
            value={newChannel.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="group">Group</Label>
          <Select onValueChange={handleGroupSelect} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a group" />
            </SelectTrigger>
            <SelectContent>
              {groups.map((group) => (
                <SelectItem key={group} value={group}>{group}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Fields</Label>
          {newChannel.fields.map((field, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <Input
                placeholder="Field name"
                value={field.name}
                onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                required
              />
              <Select 
                onValueChange={(value) => handleFieldChange(index, 'sourceField', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Source field" />
                </SelectTrigger>
                <SelectContent>
                  {sourceFields.map((sf) => (
                    <SelectItem key={sf} value={sf}>{sf}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Rule (optional)"
                value={field.rule}
                onChange={(e) => handleFieldChange(index, 'rule', e.target.value)}
              />
              <Button type="button" variant="ghost" onClick={() => removeField(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addField} className="mt-2">
            <PlusCircle className="h-4 w-4 mr-2" /> Add Field
          </Button>
        </div>
        <Button type="submit">Add Channel</Button>
      </form>
      <div>
        <h2 className="text-2xl font-bold mb-4">Existing Channels</h2>
        {channels.map((channel, index) => (
          <div key={index} className="bg-secondary p-4 rounded-lg mb-4">
            <h3 className="text-xl font-semibold">{channel.name}</h3>
            <p>Group: {channel.group}</p>
            <p>Fields:</p>
            <ul>
              {channel.fields.map((field, fieldIndex) => (
                <li key={fieldIndex}>
                  {field.name} (Source: {field.sourceField}) 
                  {field.rule && ` - Rule: ${field.rule}`}
                </li>
              ))}
            </ul>
            <Button onClick={() => handleDownload(channel.name)} className="mt-2">
              Download CSV
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
