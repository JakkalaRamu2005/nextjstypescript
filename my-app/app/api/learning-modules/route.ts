
import { NextResponse } from 'next/server';

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1JbqFSwtCEmg51txSvDM4UpJ-4fsY8kqhO9YSG8OUgxE/export?format=csv&gid=567183491";

export interface LearningModule {
    PathName: string;
    ModuleNumber: string;
    ModuleName: string;
    Description: string;
    Resources: string[];
    EstimatedHours: string;
    Difficulty: string;
}

export async function GET() {
    try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch sheet: ${response.statusText}`);
        }

        const text = await response.text();
        const modules: LearningModule[] = parseCSV(text);

        // Group by PathName
        const groupedModules: Record<string, LearningModule[]> = {};
        modules.forEach(module => {
            if (!groupedModules[module.PathName]) {
                groupedModules[module.PathName] = [];
            }
            groupedModules[module.PathName].push(module);
        });

        return NextResponse.json({ modules: groupedModules });
    } catch (error) {
        console.error("Error fetching learning modules:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

function parseCSV(text: string): LearningModule[] {
    const lines = text.split(/\r?\n/);
    const data: LearningModule[] = [];

    // Skip header row
    // We also need to filter out intermediate headers if they repeat
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const fields = parseCSVLine(line);

        // Check if this is a header row (sometimes repeated in sheets)
        if (fields[0] === 'PathName' && fields[1] === 'ModuleNumber') continue;

        if (fields.length >= 7) {
            // Clean up resources (split by comma if multiple links)
            // The CSV parser might leave commas inside the "Resource" field
            const rawResources = fields[4];
            const resources = rawResources.split(',').map(r => r.trim()).filter(r => r.startsWith('http'));

            data.push({
                PathName: fields[0],
                ModuleNumber: fields[1],
                ModuleName: fields[2],
                Description: fields[3],
                Resources: resources,
                EstimatedHours: fields[5],
                Difficulty: fields[6]
            });
        }
    }
    return data;
}

// Simple state machine CSV parser to handle quoted fields
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let currentField = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (insideQuotes) {
            if (char === '"') {
                if (i + 1 < line.length && line[i + 1] === '"') {
                    // Escaped quote
                    currentField += '"';
                    i++;
                } else {
                    // End of quoted field
                    insideQuotes = false;
                }
            } else {
                currentField += char;
            }
        } else {
            if (char === '"') {
                insideQuotes = true;
            } else if (char === ',') {
                result.push(currentField.trim());
                currentField = '';
            } else {
                currentField += char;
            }
        }
    }
    result.push(currentField.trim());
    return result;
}
