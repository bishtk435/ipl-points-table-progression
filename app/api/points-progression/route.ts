import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const season = searchParams.get('season');

    if (!season) {
      return NextResponse.json(
        { error: 'Season parameter is required' },
        { status: 400 }
      );
    }

    // Construct path to the points progression JSON file
    const filePath = path.join(
      process.cwd(),
      'data',
      'points_tables_progression',
      `${season}_points_progression.json`
    );

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `Points progression data for season ${season} not found` },
        { status: 404 }
      );
    }

    // Read and parse the file
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching points progression data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 