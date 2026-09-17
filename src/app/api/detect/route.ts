import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execFileAsync = promisify(execFile);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const uploadDir = path.join(
      process.cwd(),
      'python',
      'uploads'
    );

    await mkdir(uploadDir, { recursive: true });

    const safeName = file.name.replace(/[^\w.\-() ]+/g, '_');

    const fileName = `${Date.now()}_${safeName}`;
    const filePath = path.join(uploadDir, fileName);

    const bytes = Buffer.from(
      await file.arrayBuffer()
    );

    await writeFile(filePath, bytes);

    const scriptPath = path.join(
      process.cwd(),
      'python',
      'sonar_detect.py'
    );

    // Windows uses "py -3"; Linux/macOS uses "python3".
   const pythonCommand =
  process.platform === 'win32'
    ? 'python'
    : 'python3';

const pythonArgs = [
  scriptPath,
  filePath,
];

    console.log(
      'SONARSHIELD: Python command:',
      pythonCommand,
      pythonArgs
    );

    const { stdout, stderr } =
      await execFileAsync(
        pythonCommand,
        pythonArgs,
        {
          maxBuffer: 10 * 1024 * 1024,
          timeout: 120000,
        }
      );

    if (stderr) {
      console.warn(
        'SONARSHIELD PYTHON STDERR:',
        stderr
      );
    }

    console.log(
      'SONARSHIELD PYTHON STDOUT:',
      stdout
    );

    const output = stdout.trim();

    if (!output) {
      return NextResponse.json(
        {
          error:
            'Python detection pipeline returned no output.',
        },
        { status: 500 }
      );
    }

    let report: {
      survey?: unknown;
      detections?: unknown;
      error?: string;
    };

    try {
      report = JSON.parse(output);
    } catch (parseError) {
      console.error(
        'SONARSHIELD: Could not parse Python output:',
        output
      );

      return NextResponse.json(
        {
          error:
            'Python pipeline returned invalid JSON.',
          details: output,
        },
        { status: 500 }
      );
    }

    if (report.error) {
      return NextResponse.json(
        {
          error: report.error,
        },
        { status: 500 }
      );
    }

    if (
      !report.survey ||
      !Array.isArray(report.detections)
    ) {
      return NextResponse.json(
        {
          error:
            'Python pipeline returned an invalid detection report.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error(
      'SONARSHIELD API ERROR:',
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Detection pipeline failed',
      },
      { status: 500 }
    );
  }
}