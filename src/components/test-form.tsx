"use client";

import { useState } from "react";
import { TestPayload } from "@/types/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TestFormProps {
  onSubmit: (payload: TestPayload) => void;
  loading: boolean;
}

interface Framework {
  name: string;
  port: number;
}

export function TestForm({ onSubmit, loading }: TestFormProps) {
  const frameworks: Framework[] = [
    { name: "Express.js", port: 3002 },
    { name: "Spring Boot", port: 8080 },
    { name: "Flask", port: 5000 },
    { name: "Gin", port: 8080 },
    { name: "Laravel", port: 8000 },
  ];

  const [formData, setFormData] = useState<TestPayload>({
    method: "GET",
    port: 3002, // Default to Express.js port
    vus: 10,
    duration: 30,
  });

  const [selectedFramework, setSelectedFramework] = useState<string | null>();

  const handleChange = (field: keyof TestPayload, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFrameworkChange = (frameworkName: string) => {
    const framework = frameworks.find(f => f.name === frameworkName);
    if (framework) {
      setSelectedFramework(frameworkName);
      setFormData(prev => ({
        ...prev,
        port: framework.port
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="method">HTTP Method</Label>
          <Select
            value={formData.method}
            onValueChange={(value) => handleChange("method", value)}
            disabled={loading}
          >
            <SelectTrigger id="method">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="framework">Framework</Label>
          <Select
            value={selectedFramework || ""}
            onValueChange={handleFrameworkChange}
            disabled={loading}
          >
            <SelectTrigger id="framework">
              <SelectValue placeholder="Select framework" />
            </SelectTrigger>
            <SelectContent>
              {frameworks.map((framework) => (
                <SelectItem key={`${framework.name}`} value={framework.name}>
                  {framework.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vus">Virtual Users</Label>
          <Input
            id="vus"
            type="number"
            value={formData.vus}
            onChange={(e) => handleChange("vus", parseInt(e.target.value, 10))}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (seconds)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => handleChange("duration", parseInt(e.target.value, 10))}
            disabled={loading}
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="default"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Running Test..." : "Run Test"}
      </Button>
    </form>
  );
}