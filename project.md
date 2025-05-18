# Codebase Snapshot

Source Directory: `ayanda`

## README.md

```markdown
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```

## components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

## eslint.config.mjs

```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;

```

## next-env.d.ts

```
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

```

## next.config.ts

```
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

```

## package.json

```json
{
  "name": "out",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@google/genai": "^0.14.1",
    "@google/generative-ai": "^0.17.0",
    "@radix-ui/react-checkbox": "^1.3.1",
    "@radix-ui/react-dropdown-menu": "^2.1.14",
    "@radix-ui/react-popover": "^1.1.13",
    "@radix-ui/react-progress": "^1.1.6",
    "@radix-ui/react-select": "^2.2.4",
    "@radix-ui/react-slot": "^1.2.2",
    "@tailwindcss/typography": "^0.5.16",
    "bcryptjs": "^2.4.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "geist": "^1.4.2",
    "lucide-react": "^0.511.0",
    "mongoose": "^8.6.0",
    "next": "15.3.2",
    "next-auth": "^4.24.7",
    "react": "^19.0.0",
    "react-day-picker": "^8.10.1",
    "react-dom": "^19.0.0",
    "react-markdown": "^10.1.0",
    "tailwind-merge": "^3.3.0",
    "tailwindcss-animate": "^1.0.7",
    "uuid": "^11.1.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/uuid": "^10.0.0",
    "eslint": "^9",
    "eslint-config-next": "15.3.2",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.3.0",
    "typescript": "^5"
  }
}

```

## postcss.config.mjs

```javascript
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;

```

## project.md

```markdown

```

## ss.py

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Standalone Codebase Snapshot Tool (Concise Commands)

This script provides two main functions, runnable from the command line:
1.  fm <folder>: Creates a single Markdown file snapshot from a source code folder.
2.  mf <markdown_file>: Recreates a folder structure from a Markdown snapshot file.

Usage:
  # Create snapshot FROM 'my_project_folder' TO 'snapshot.md' (Folder -> Markdown)
  python this_script.py fm ./my_project_folder -o snapshot.md

  # Create snapshot with additional ignore patterns
  python this_script.py fm ./proj -o out.md --ignore "*.log" --ignore "temp/"

  # Recreate folder structure FROM 'snapshot.md' TO 'recreated_project' (Markdown -> Folder)
  python this_script.py mf snapshot.md -o ./recreated_project
"""

import os
import mimetypes
import fnmatch
import platform
import argparse
import sys

# --- Configuration ---
ENCODING = 'utf-8'

# --- Default Ignore Patterns ---
DEFAULT_IGNORE_PATTERNS = [
    '.git', '.gitignore', '.gitattributes', '.svn', '.hg', 'node_modules',
    'bower_components', 'venv', '.venv', 'env', '.env', '.env.*', '*.pyc',
    '__pycache__', 'build', 'dist', 'target', '*.o', '*.so', '*.dll', '*.exe',
    '*.class', '*.jar', '*.war', '*.log', '*.tmp', '*.swp', '*.swo', '.DS_Store',
    'Thumbs.db', '.vscode', '.idea', '*.sublime-project', '*.sublime-workspace',
    '*.zip', '*.tar', '*.gz', '*.rar', 'credentials.*', 'config.local.*',
    'settings.local.py',"package-lock.json",".next"
]

# --- Core Helper Functions (No Changes Here) ---

def is_ignored(relative_path, ignore_patterns):
    normalized_path = relative_path.replace("\\", "/")
    basename = os.path.basename(normalized_path)
    is_case_sensitive_fs = platform.system() != "Windows"
    for pattern in ignore_patterns:
        if fnmatch.fnmatch(basename, pattern) or \
           (not is_case_sensitive_fs and fnmatch.fnmatch(basename.lower(), pattern.lower())):
            return True
        if fnmatch.fnmatch(normalized_path, pattern) or \
           (not is_case_sensitive_fs and fnmatch.fnmatch(normalized_path.lower(), pattern.lower())):
            return True
    return False

def guess_language(filepath):
    mimetypes.init()
    mime_type, _ = mimetypes.guess_type(filepath)
    if mime_type:
        lang_map_mime = {
            "text/x-python": "python", "application/x-python-code": "python",
            "text/javascript": "javascript", "application/javascript": "javascript",
            "text/html": "html", "text/css": "css", "application/json": "json",
            "application/xml": "xml", "text/xml": "xml",
            "text/x-java-source": "java", "text/x-java": "java",
            "text/x-csrc": "c", "text/x-c": "c", "text/x-c++src": "cpp", "text/x-c++": "cpp",
            "application/x-sh": "bash", "text/x-shellscript": "bash",
            "text/markdown": "markdown", "text/x-yaml": "yaml", "application/x-yaml": "yaml",
            "text/plain": ""
        }
        if mime_type in lang_map_mime: return lang_map_mime[mime_type]
        if mime_type.startswith("text/"): return ""
    _, ext = os.path.splitext(filepath.lower())
    lang_map_ext = {
        ".py": "python", ".pyw": "python", ".js": "javascript", ".mjs": "javascript", ".cjs": "javascript",
        ".html": "html", ".htm": "html", ".css": "css", ".java": "java", ".cpp": "cpp", ".cxx": "cpp",
        ".cc": "cpp", ".hpp": "cpp", ".hxx": "cpp", ".c": "c", ".h": "c", ".cs": "csharp", ".php": "php",
        ".rb": "ruby", ".go": "go", ".rs": "rust", ".ts": "typescript", ".tsx": "typescript",
        ".json": "json", ".xml": "xml", ".yaml": "yaml", ".yml": "yaml", ".sh": "bash", ".bash": "bash",
        ".sql": "sql", ".md": "markdown", ".markdown": "markdown", ".txt": ""
    }
    return lang_map_ext.get(ext, "")

def write_code_to_file(output_dir, relative_filepath, code_lines, encoding=ENCODING):
    safe_relative_path = os.path.normpath(relative_filepath).replace("\\", "/")
    if safe_relative_path.startswith("..") or os.path.isabs(safe_relative_path):
        print(f"[WRITE] [WARN] Skipping potentially unsafe path: {relative_filepath}")
        return False
    abs_output_dir = os.path.abspath(output_dir)
    full_path = os.path.join(abs_output_dir, safe_relative_path)
    abs_full_path = os.path.abspath(full_path)
    if not abs_full_path.startswith(abs_output_dir + os.path.sep) and abs_full_path != abs_output_dir:
        print(f"[WRITE] [ERROR] Security Error: Attempted write outside target directory: {relative_filepath} -> {abs_full_path}")
        return False
    dir_name = os.path.dirname(full_path)
    try:
        if dir_name: os.makedirs(dir_name, exist_ok=True)
        if os.path.isdir(full_path):
             print(f"[WRITE] [ERROR] Cannot write file. Path exists and is a directory: {full_path}")
             return False
        with open(full_path, "w", encoding=encoding) as outfile:
            outfile.writelines(code_lines)
        return True
    except OSError as e:
        print(f"[WRITE] [ERROR] OS Error writing file {full_path}: {e}")
        return False
    except Exception as e:
        print(f"[WRITE] [ERROR] General Error writing file {full_path}: {e}")
        return False

# --- Main Logic Functions (No Changes Here) ---

def create_codebase_snapshot(root_dir, output_file, encoding=ENCODING, base_ignore_patterns=DEFAULT_IGNORE_PATTERNS, user_ignore_patterns=[]):
    processed_files_count = 0
    ignored_items_count = 0
    errors = []
    all_ignore_patterns = list(set(base_ignore_patterns + user_ignore_patterns))
    abs_root = os.path.abspath(root_dir)
    if not os.path.isdir(abs_root):
        print(f"[ERROR] Source directory not found or not a directory: {abs_root}", file=sys.stderr)
        return False, 0, 0, ["Source directory not found."]

    print("-" * 60)
    print(f"Starting snapshot creation (Folder -> Markdown):")
    print(f"  Source: {abs_root}")
    print(f"  Output: {output_file}")
    print(f"  Ignoring: {all_ignore_patterns}")
    print("-" * 60)
    try:
        with open(output_file, "w", encoding=encoding) as md_file:
            md_file.write("# Codebase Snapshot\n\n")
            md_file.write(f"Source Directory: `{os.path.basename(abs_root)}`\n\n")
            for dirpath, dirnames, filenames in os.walk(abs_root, topdown=True):
                dirs_to_remove = set()
                for d in dirnames:
                    rel_dir_path = os.path.relpath(os.path.join(dirpath, d), abs_root)
                    if is_ignored(rel_dir_path, all_ignore_patterns): dirs_to_remove.add(d)
                if dirs_to_remove:
                    ignored_items_count += len(dirs_to_remove)
                    dirnames[:] = [d for d in dirnames if d not in dirs_to_remove]
                filenames.sort()
                for filename in filenames:
                    filepath = os.path.join(dirpath, filename)
                    relative_filepath = os.path.relpath(filepath, abs_root).replace("\\", "/")
                    if is_ignored(relative_filepath, all_ignore_patterns):
                        ignored_items_count += 1; continue
                    processed_files_count += 1
                    print(f"[PROCESS] Adding: {relative_filepath}")
                    md_file.write(f"## {relative_filepath}\n\n")
                    try:
                        try:
                             with open(filepath, "r", encoding=encoding) as f_content: content = f_content.read()
                             language = guess_language(filepath)
                             md_file.write(f"```{language}\n{content}\n```\n\n")
                        except UnicodeDecodeError:
                             md_file.write("```\n**Note:** File appears to be binary or uses an incompatible encoding.\nContent not displayed.\n```\n\n")
                             print(f"[WARN] Binary or non-{encoding} file skipped content: {relative_filepath}")
                        except Exception as read_err:
                             errors.append(f"Error reading file '{relative_filepath}': {read_err}")
                             md_file.write(f"```\n**Error reading file:** {read_err}\n```\n\n")
                             print(f"[ERROR] Could not read file: {relative_filepath} - {read_err}")
                    except Exception as e:
                        errors.append(f"Error processing file '{relative_filepath}': {e}")
                        md_file.write(f"```\n**Error processing file:** {e}\n```\n\n")
                        print(f"[ERROR] Processing failed for: {relative_filepath} - {e}")
    except IOError as e:
        print(f"[ERROR] Failed to write snapshot file '{output_file}': {e}", file=sys.stderr)
        return False, processed_files_count, ignored_items_count, [f"IOError writing snapshot: {e}"]
    except Exception as e:
        print(f"[ERROR] An unexpected error occurred during snapshot generation: {e}", file=sys.stderr)
        return False, processed_files_count, ignored_items_count, [f"Unexpected error: {e}"]
    print("-" * 60)
    print(f"Snapshot creation finished.")
    print(f"  Processed: {processed_files_count} files")
    print(f"  Ignored:   {ignored_items_count} items")
    if errors: print(f"  Errors:    {len(errors)}"); [print(f"    - {err}") for err in errors]
    print("-" * 60)
    return True, processed_files_count, ignored_items_count, errors

def extract_codebase(md_file, output_dir, encoding=ENCODING):
    created_files_count = 0; errors = []; file_write_attempts = 0
    abs_output_dir = os.path.abspath(output_dir)
    if not os.path.isfile(md_file):
        print(f"[ERROR] Snapshot file not found: {md_file}", file=sys.stderr)
        return False, 0, ["Snapshot file not found."]
    print("-" * 60); print(f"Starting codebase extraction (Markdown -> Folder):"); print(f"  Snapshot: {md_file}"); print(f"  Output Directory: {abs_output_dir}"); print("-" * 60)
    try:
        os.makedirs(abs_output_dir, exist_ok=True); print(f"[INFO] Ensured output directory exists: {abs_output_dir}")
    except OSError as e: print(f"[ERROR] Failed to create output directory '{abs_output_dir}': {e}", file=sys.stderr); return False, 0, [f"Failed to create output directory: {e}"]
    try:
        with open(md_file, "r", encoding=encoding) as f: lines = f.readlines()
    except Exception as e: print(f"[ERROR] Failed to read snapshot file '{md_file}': {e}", file=sys.stderr); return False, 0, [f"Failed to read snapshot file: {e}"]
    relative_filepath = None; in_code_block = False; code_lines = []; skip_block_content = False
    for line_num, line in enumerate(lines, 1):
        line_stripped = line.strip()
        if line_stripped.startswith("## "):
            if relative_filepath and code_lines and not skip_block_content:
                file_write_attempts += 1
                if write_code_to_file(abs_output_dir, relative_filepath, code_lines, encoding): created_files_count += 1
                else: errors.append(f"Failed write: {relative_filepath} (ended near line {line_num})")
            code_lines = []; relative_filepath = None; in_code_block = False; skip_block_content = False
            new_relative_filepath = line[3:].strip().strip('/').strip('\\')
            if not new_relative_filepath: errors.append(f"Warning: Found '##' header without a filepath on line {line_num}. Skipping.")
            else: relative_filepath = new_relative_filepath
        elif line_stripped.startswith("```"):
            if in_code_block:
                in_code_block = False
                if relative_filepath and code_lines and not skip_block_content:
                     file_write_attempts += 1
                     if write_code_to_file(abs_output_dir, relative_filepath, code_lines, encoding): created_files_count += 1
                     else: errors.append(f"Failed write: {relative_filepath} (block ended line {line_num})")
                elif skip_block_content: pass
                elif relative_filepath and not code_lines:
                    file_write_attempts += 1; print(f"[WARN] Empty code block for {relative_filepath} on line {line_num}. Creating empty file.")
                    if write_code_to_file(abs_output_dir, relative_filepath, [], encoding): created_files_count += 1
                    else: errors.append(f"Failed write (empty): {relative_filepath}")
                elif not relative_filepath and code_lines: errors.append(f"Warning: Code block found ending on line {line_num} without a preceding '## filepath' header. Content ignored.")
                code_lines = []; skip_block_content = False
            else: in_code_block = True; code_lines = []; skip_block_content = False
        elif in_code_block:
            if line_stripped.startswith("**Note:") or line_stripped.startswith("**Error reading file:") or line_stripped.startswith("**Binary File:"):
                 skip_block_content = True; print(f"[INFO] Skipping content block for {relative_filepath} due to marker: {line_stripped[:30]}...")
            if not skip_block_content: code_lines.append(line)
    if relative_filepath and code_lines and not skip_block_content:
        file_write_attempts += 1
        if write_code_to_file(abs_output_dir, relative_filepath, code_lines, encoding): created_files_count += 1
        else: errors.append(f"Failed write (end of file): {relative_filepath}")
    elif relative_filepath and skip_block_content: pass
    print("-" * 60); print(f"Codebase extraction finished."); print(f"  Attempted writes: {file_write_attempts}"); print(f"  Successfully created: {created_files_count} files")
    if errors: print(f"  Errors/Warnings: {len(errors)}"); [print(f"    - {err}") for err in errors]
    print("-" * 60)
    return True, created_files_count, errors


# --- Command Line Interface (Modified for Positional Args) ---
def main():
    parser = argparse.ArgumentParser(
        description="Standalone Codebase Snapshot Tool. Use 'fm <folder>' or 'mf <markdown_file>'.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""Examples:
  python %(prog)s fm ./my_project -o project_snapshot.md
  python %(prog)s mf project_snapshot.md -o ./recreated_project"""
    )

    subparsers = parser.add_subparsers(dest='command', required=True, help='Available commands: fm, mf')

    # --- Sub-parser for fm (Folder to Markdown) ---
    parser_fm = subparsers.add_parser('fm', help='Create Markdown from Folder.')
    # Positional argument for input directory
    parser_fm.add_argument('input_directory', help='Path to the source code directory.')
    # Optional argument for output file
    parser_fm.add_argument('--output', '-o', required=True, dest='output_markdown', help='Path for the output Markdown snapshot file.')
    # Optional ignore patterns (remains the same)
    parser_fm.add_argument('--ignore', action='append', default=[], help='Additional ignore patterns (glob style). Can be used multiple times.')

    # --- Sub-parser for mf (Markdown to Folder) ---
    parser_mf = subparsers.add_parser('mf', help='Create Folder from Markdown.')
    # Positional argument for input markdown file
    parser_mf.add_argument('input_markdown', help='Path to the input Markdown snapshot file.')
    # Optional argument for output directory
    parser_mf.add_argument('--output', '-o', required=True, dest='output_directory', help='Path to the directory where the codebase will be recreated.')

    args = parser.parse_args()

    # --- Execute selected command ---
    if args.command == 'fm':
        print(f"Running: Folder to Markdown (fm)")
        success, processed, ignored, errors = create_codebase_snapshot(
            root_dir=args.input_directory,       # Use positional arg
            output_file=args.output_markdown,    # Use '-o' arg (renamed via dest)
            encoding=ENCODING,
            base_ignore_patterns=DEFAULT_IGNORE_PATTERNS,
            user_ignore_patterns=args.ignore
        )
        if success:
            print(f"\nSuccess! Snapshot created at: {args.output_markdown}")
            print(f"Processed {processed} files, ignored {ignored} items.")
            if errors: print(f"Completed with {len(errors)} errors/warnings during file processing.")
            sys.exit(0)
        else:
            print(f"\nFailed to create snapshot.", file=sys.stderr)
            sys.exit(1)

    elif args.command == 'mf':
        print(f"Running: Markdown to Folder (mf)")
        success, created_count, errors = extract_codebase(
            md_file=args.input_markdown,       # Use positional arg
            output_dir=args.output_directory,  # Use '-o' arg (renamed via dest)
            encoding=ENCODING
        )
        if success:
             print(f"\nSuccess! Codebase extracted to: {args.output_directory}")
             print(f"Created {created_count} files.")
             if errors: print(f"Completed with {len(errors)} errors/warnings during file writing.")
             sys.exit(0)
        else:
            print(f"\nFailed to extract codebase.", file=sys.stderr)
            sys.exit(1)

# --- Main Execution Guard ---
if __name__ == '__main__':
    main()

```

## tailwind.config.ts

```
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Important for manual dark mode toggling
  theme: {
    extend: {
      fontFamily: {
        // Use a CSS variable that ThemeProvider will update
        sans: ['var(--font-selected-app)', 'var(--font-inter)', 'sans-serif'],
        orbitron: ['var(--font-orbitron-val)', 'sans-serif'],
        // Individual font variables are also available if needed directly
        inter: ['var(--font-inter)', 'sans-serif'],
        'geist-sans': ['var(--font-geist-sans)', 'sans-serif'],
        manrope: ['var(--font-manrope)', 'sans-serif'],
        lexend: ['var(--font-lexend)', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
        'jetbrains-mono': ['var(--font-jetbrains-mono)', 'monospace'],
        lora: ['var(--font-lora)', 'serif'],
      },
      colors: {
        // Define colors using CSS variables that will be dynamically set
        // These are for Tailwind's `theme()` helper and JIT engine
        // The actual color values will come from :root via ThemeProvider
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        widget: 'var(--widget-background-val)', // Custom name
        'widget-bg': 'var(--widget-background-val)', // Alias if needed
        'text-main': 'var(--text-color-val)',
        'text-muted': 'var(--text-muted-color-val)',
        'border-main': 'var(--border-color-val)',
        'input-bg': 'var(--input-bg-val)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        ring: 'var(--ring)',
        input: 'var(--input)', // shadcn input border color

        // Your custom palette variable names
        'accent-color': 'var(--accent-color-val)',
        'background-color': 'var(--background-color-val)',
        'widget-background': 'var(--widget-background-val)',
        'text-color': 'var(--text-color-val)',
        'text-muted-color': 'var(--text-muted-color-val)',
        'border-color': 'var(--border-color-val)',
        'danger-color': 'var(--danger-color-val)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Add typography for react-markdown
      typography: ({ theme }: { theme: (path: string, defaultValue?: any) => any }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.foreground'),
            a: {
              color: theme('colors.primary'),
              '&:hover': {
                color: `hsl(var(--accent-color-hsl) / 0.8)`,
              },
            },
            strong: { color: theme('colors.foreground') },
            code: { color: theme('colors.primary'), backgroundColor: `hsl(var(--accent-color-hsl) / 0.1)` , padding: '0.2em 0.4em', borderRadius: '0.25rem'},
            blockquote: { color: theme('colors.muted-foreground'), borderLeftColor: theme('colors.border')},
            h1: { color: theme('colors.foreground') },
            h2: { color: theme('colors.foreground') },
            h3: { color: theme('colors.foreground') },
            h4: { color: theme('colors.foreground') },
            'ul > li::before': { backgroundColor: theme('colors.muted-foreground') },
            'ol > li::before': { color: theme('colors.muted-foreground') },
          },
        },
        sm: { // for prose-sm
             css: {
                fontSize: '0.875rem', // text-sm
                p: { marginTop: '0.75em', marginBottom: '0.75em'},
                ul: { marginTop: '0.75em', marginBottom: '0.75em'},
                ol: { marginTop: '0.75em', marginBottom: '0.75em'},
                // Add other specific sm styles if needed
             }
        },
        invert: { // For dark mode, if using prose-invert
          css: {
            color: theme('colors.foreground'), // Assuming foreground is already dark-mode aware
            a: {
              color: theme('colors.primary'),
               '&:hover': {
                color: `hsl(var(--accent-color-hsl) / 0.8)`,
              },
            },
            strong: { color: theme('colors.foreground') },
            code: { color: theme('colors.primary'), backgroundColor: `hsl(var(--accent-color-hsl) / 0.15)`},
            blockquote: { color: theme('colors.muted-foreground'), borderLeftColor: theme('colors.border')},
            h1: { color: theme('colors.foreground') },
            h2: { color: theme('colors.foreground') },
            h3: { color: theme('colors.foreground') },
            h4: { color: theme('colors.foreground') },
            'ul > li::before': { backgroundColor: theme('colors.muted-foreground') },
            'ol > li::before': { color: theme('colors.muted-foreground') },
          },
        },
      }),
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'), // New plugin
  ],
};

export default config;
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

```

## public/file.svg

```
<svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z" clip-rule="evenodd" fill="#666" fill-rule="evenodd"/></svg>
```

## public/globe.svg

```
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="#666"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
```

## public/next.svg

```
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>
```

## public/vercel.svg

```
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1155 1000"><path d="m577.3 0 577.4 1000H0z" fill="#fff"/></svg>
```

## public/window.svg

```
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="#666"/></svg>
```

## ayanda/src/components/ui/select.tsx

```typescript
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}


```

## ayanda/src/components/views/CalendarFullScreenView.tsx

```typescript
"use client"; 

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Event as AppEvent, Category, RecurrenceRule } from '@/types';
import { cn } from '@/lib/utils';
import { X, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight, Repeat, Eye, Pencil } from 'lucide-react'; // Added Eye, Pencil
import { DateFormatter, DayPicker } from "react-day-picker"; 
import { format, parseISO, isValid as isValidDate, add, startOfDay } from 'date-fns';
import type { Locale } from 'date-fns';
import ReactMarkdown from 'react-markdown'; // Added for Markdown Preview

// Markdown Cheatsheet (moved from NotesView for potential reuse if needed, or keep in NotesView if only used there)
const MarkdownCheatsheet: React.FC = () => (
  <div className="p-3 text-xs space-y-1 text-muted-foreground bg-popover border border-border rounded-md shadow-md w-64">
    <p><strong># H1</strong>, <strong>## H2</strong>, <strong>### H3</strong></p>
    <p><strong>**bold**</strong> or __bold__</p>
    <p><em>*italic*</em> or _italic_</p>
    <p>~<sub>~</sub>Strikethrough~<sub>~</sub></p>
    <p>Unordered List: <br />- Item 1<br />- Item 2</p>
    <p>Ordered List: <br />1. Item 1<br />2. Item 2</p>
    <p>Checklist: <br />- [ ] To do<br />- [x] Done</p>
    <p>[Link Text](https://url.com)</p>
    <p>`Inline code`</p>
    <p>```<br />Code block<br />```</p>
  </div>
);


// Simplified Recurrence Editor Component for Events (can be expanded or shared)
const EventRecurrenceEditor: React.FC<{
  recurrence: RecurrenceRule | undefined;
  onChange: (rule: RecurrenceRule | undefined) => void;
  startDate: string; // YYYY-MM-DD format from the event form
}> = ({ recurrence, onChange, startDate }) => {
  const [type, setType] = useState(recurrence?.type || ''); 
  const [interval, setIntervalValue] = useState(recurrence?.interval || 1);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(recurrence?.daysOfWeek || []);
  const [endDate, setEndDate] = useState(recurrence?.endDate || '');

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    if (type && interval > 0) {
      const newRule: RecurrenceRule = { type, interval };
      if (type === 'weekly' && daysOfWeek.length > 0) {
        newRule.daysOfWeek = daysOfWeek.sort((a,b) => a-b);
      } else if (type === 'weekly' && startDate && daysOfWeek.length === 0) { 
         const startDay = parseISO(startDate + 'T00:00:00Z').getDay(); 
         newRule.daysOfWeek = [startDay];
      }
      if (endDate) newRule.endDate = endDate;
      onChange(newRule);
    } else {
      onChange(undefined); 
    }
  }, [type, interval, daysOfWeek, endDate, onChange, startDate]);

  const toggleDay = (dayIndex: number) => {
    setDaysOfWeek(prev => prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex]);
  };
  
  if (type === '') { 
    return <Button variant="outline" size="sm" onClick={() => setType('weekly')} className="w-full input-field text-xs justify-start font-normal"><Repeat className="w-3 h-3 mr-1.5"/>Set Recurrence</Button>
  }

  return (
    <div className="space-y-2 p-3 border border-border-main rounded-md bg-input-bg/50 mt-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">Recurrence</p>
        <Button variant="ghost" size="icon" className="w-5 h-5" onClick={() => { onChange(undefined); setType(''); }}><X className="w-3 h-3"/></Button>
      </div>
      <Select value={type} onValueChange={(val) => setType(val as RecurrenceRule['type'])}>
        <SelectTrigger className="input-field text-xs h-8"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly (on start date's day)</SelectItem>
          <SelectItem value="yearly">Yearly (on start date)</SelectItem>
        </SelectContent>
      </Select>
      <Input type="number" value={interval} onChange={e => setIntervalValue(Math.max(1, parseInt(e.target.value)))} placeholder="Interval" className="input-field text-xs h-8" />
      {type === 'weekly' && (
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
          {weekDays.map((day, i) => (
            <Button key={i} variant={daysOfWeek.includes(i) ? 'default': 'outline'} size="sm" onClick={() => toggleDay(i)} className={cn("text-[10px] flex-1 h-7 px-1", daysOfWeek.includes(i) ? 'bg-primary text-primary-foreground' : 'border-border-main')}>
              {day}
            </Button>
          ))}
        </div>
      )}
      <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} placeholder="End Date (optional)" title="Recurrence End Date" className="input-field text-xs h-8" />
    </div>
  );
};


interface CalendarFullScreenViewProps {
  events: AppEvent[];
  categories: Category[];
  currentCategory: Category; 
  onAddEvent: (eventData: Omit<AppEvent, 'id' | 'userId'>) => void;
  onUpdateEvent: (eventId: string, eventUpdateData: Partial<Omit<AppEvent, 'id' | 'userId'>>) => void;
  onDeleteEvent: (eventId: string) => void;
  onClose: () => void;
}

interface EventFormData {
  title: string;
  date: string; 
  time: string; 
  category: Category;
  description?: string;
  recurrenceRule?: RecurrenceRule;
}

export function CalendarFullScreenView({
  events, categories, currentCategory, onAddEvent, onUpdateEvent, onDeleteEvent, onClose
}: CalendarFullScreenViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMonth, setViewMonth] = useState<Date>(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null);
  const [isPreviewingDescription, setIsPreviewingDescription] = useState(false);
  
  // FIX 1: Memoize initialFormCategory
  const getInitialFormCategory = useCallback(() => {
    // `currentCategory` here is the prop passed to CalendarFullScreenView,
    // which in HomePage is already resolved to a specific category or the first available if "All Projects".
    if (categories.includes(currentCategory)) return currentCategory;
    const firstSpecificCategory = categories.find(c => c !== "All Projects");
    if (firstSpecificCategory) return firstSpecificCategory;
    return categories.length > 0 ? categories[0] : "Personal Life" as Category;
  }, [currentCategory, categories]);


  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '12:00',
    category: getInitialFormCategory(),
    description: '',
    recurrenceRule: undefined,
  });

  // FIX 2: Refined useEffect to prevent unnecessary updates
  useEffect(() => {
    if (selectedDate && !showEventForm && !editingEvent) {
      const newCategoryForForm = getInitialFormCategory();
      const newDateForForm = format(selectedDate, 'yyyy-MM-dd');
      
      setFormData(prev => {
        if (prev.date !== newDateForForm || prev.category !== newCategoryForForm) {
          return {
            ...prev,
            date: newDateForForm,
            category: newCategoryForForm
          };
        }
        return prev; // No change needed, return previous state reference
      });
    }
  }, [selectedDate, showEventForm, editingEvent, getInitialFormCategory]);


  useEffect(() => {
    if (editingEvent) {
      const eventDateObj = parseISO(editingEvent.date);
      setFormData({
        title: editingEvent.title,
        date: format(eventDateObj, 'yyyy-MM-dd'),
        time: format(eventDateObj, 'HH:mm'),
        category: editingEvent.category,
        description: editingEvent.description || '',
        recurrenceRule: editingEvent.recurrenceRule,
      });
      setShowEventForm(true);
      setIsPreviewingDescription(false); // Reset preview state when starting edit
    }
  }, [editingEvent]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value as Category }));
  };
  const handleRecurrenceChange = (rule: RecurrenceRule | undefined) => {
    setFormData(prev => ({ ...prev, recurrenceRule: rule}));
  }

  const handleSubmitEvent = () => {
    if (!formData.title || !formData.date || !formData.time) return;
    const dateTimeString = `${formData.date}T${formData.time}:00.000Z`; 
    
    const eventDataSubmit = {
        title: formData.title,
        date: dateTimeString,
        category: formData.category,
        description: formData.description,
        recurrenceRule: formData.recurrenceRule,
        // userId will be added by backend
    };

    if (editingEvent) {
      onUpdateEvent(editingEvent.id, eventDataSubmit);
    } else {
      onAddEvent(eventDataSubmit);
    }
    resetForm();
  };

  const resetForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
    setIsPreviewingDescription(false);
    setFormData({
      title: '',
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      time: '12:00',
      category: getInitialFormCategory(),
      description: '',
      recurrenceRule: undefined,
    });
  };
  
  const getNextOccurrence = (event: AppEvent, fromDate: Date): Date | null => {
    if (!event.recurrenceRule) return null;
    const rule = event.recurrenceRule;
    let baseDate = startOfDay(parseISO(event.date)); 
    let checkDate = startOfDay(fromDate); 

    if (baseDate > checkDate) { 
        if(rule.type === 'weekly' && rule.daysOfWeek && rule.daysOfWeek.length > 0 && !rule.daysOfWeek.includes(baseDate.getDay())) {
           // continue
        } else {
            if(rule.endDate && baseDate > parseISO(rule.endDate)) return null;
            return baseDate;
        }
    }
    
    for(let i=0; i< (rule.count || 365); i++) { 
        let next: Date;
        let potentialBase = baseDate;
        // If baseDate is before checkDate, we need to find the first occurrence of the rule *on or after* checkDate
        // This is a simplified loop; a full rrule library is better for complex scenarios
        if (baseDate < checkDate) {
            let diffMultiplier = 0;
            switch(rule.type) {
                case 'daily': diffMultiplier = Math.ceil((checkDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24 * rule.interval)); break;
                case 'weekly': diffMultiplier = Math.ceil((checkDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24 * 7 * rule.interval)); break;
                case 'monthly': diffMultiplier = Math.ceil(((checkDate.getFullYear() - baseDate.getFullYear())*12 + (checkDate.getMonth() - baseDate.getMonth())) / rule.interval); break;
                case 'yearly': diffMultiplier = Math.ceil((checkDate.getFullYear() - baseDate.getFullYear()) / rule.interval); break;
            }
            potentialBase = add(baseDate, { 
                days: rule.type === 'daily' ? rule.interval * Math.max(i, diffMultiplier) : 0,
                weeks: rule.type === 'weekly' ? rule.interval * Math.max(i, diffMultiplier) : 0,
                months: rule.type === 'monthly' ? rule.interval * Math.max(i, diffMultiplier) : 0,
                years: rule.type === 'yearly' ? rule.interval * Math.max(i, diffMultiplier) : 0,
            });
        } else {
            potentialBase = add(baseDate, { 
                days: rule.type === 'daily' ? rule.interval * i : 0,
                weeks: rule.type === 'weekly' ? rule.interval * i : 0,
                months: rule.type === 'monthly' ? rule.interval * i : 0,
                years: rule.type === 'yearly' ? rule.interval * i : 0,
            });
        }
        next = potentialBase;

        if(rule.type === 'weekly' && rule.daysOfWeek && rule.daysOfWeek.length > 0) {
            let currentDay = next.getDay();
            let targetDay = rule.daysOfWeek.find(d => d >= currentDay) ?? rule.daysOfWeek[0];
            let dayDiff = targetDay - currentDay;
            if (dayDiff < 0) { // Target day passed for this week iteration
                next = add(next, { days: 7 - currentDay + targetDay }); // Go to next week's target day if interval is 1
                                                                    // For intervals > 1, this gets more complex
            } else {
                next = add(next, { days: dayDiff });
            }
        }
        next = startOfDay(next);

        if(next >= checkDate) { 
             if (rule.endDate && next > startOfDay(parseISO(rule.endDate))) return null; 
            return next;
        }
    }
    return null;
  };


  const DayCellContent: DateFormatter = useCallback((day, options) => { 
    const dayStart = startOfDay(day);
    let hasBaseEvent = false;
    let hasRecurringInstance = false;

    events.forEach(event => {
        if (!event) return;
        const eventBaseDate = startOfDay(parseISO(event.date));
        if (eventBaseDate.getTime() === dayStart.getTime()) {
            hasBaseEvent = true;
        }
        if (event.recurrenceRule) {
            const next = getNextOccurrence(event, add(dayStart, {days: -1})); 
            if (next && startOfDay(next).getTime() === dayStart.getTime()) {
                hasRecurringInstance = true;
            }
        }
    });

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {format(day, "d", { locale: options?.locale })} 
        {(hasBaseEvent || hasRecurringInstance) && (
          <span className={cn(
              "absolute bottom-1.5 left-1/2 -translate-x-1/2 size-1.5 rounded-full",
              hasBaseEvent && hasRecurringInstance ? "bg-gradient-to-r from-primary to-destructive" :
              hasBaseEvent ? "bg-primary" : 
              "bg-primary/50" 
          )} />
        )}
      </div>
    );
  }, [events]);
  
  const eventsForSelectedDay = selectedDate ? events.flatMap(event => {
    if (!event) return [];
    const eventDateObj = parseISO(event.date);
    const selectedDayStart = startOfDay(selectedDate);
    const eventDayStart = startOfDay(eventDateObj);
    
    const results: AppEvent[] = [];
    if (eventDayStart.getTime() === selectedDayStart.getTime()) {
        results.push(event); 
    }
    
    if (event.recurrenceRule) {
        const next = getNextOccurrence(event, add(selectedDayStart, {days: -1}));
        if (next && startOfDay(next).getTime() === selectedDayStart.getTime()) {
            if (eventDayStart.getTime() !== selectedDayStart.getTime()) { 
                results.push({
                    ...event,
                    date: format(selectedDate, 'yyyy-MM-dd') + 'T' + format(eventDateObj, 'HH:mm:ss.SSS') + 'Z', 
                });
            }
        }
    }
    return results;

  }).filter((event, index, self) => index === self.findIndex((e) => e.id === event.id && e.date === event.date)) 
  .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()) : [];


  return (
    <div className={cn(
        "fixed inset-0 z-[85] bg-background p-6 flex flex-col",
        "pt-[calc(5rem+2.75rem+1.5rem)]" 
    )}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="font-orbitron text-3xl accent-text">Calendar</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:accent-text p-2 rounded-md hover:bg-input-bg">
                <X className="w-7 h-7" />
            </Button>
        </div>

        <div className="flex-grow flex gap-6 overflow-hidden">
            <div className="w-2/3 lg:w-3/4 bg-widget-background border border-border-main rounded-md p-6 flex flex-col items-center justify-start custom-scrollbar-fullscreen">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    month={viewMonth}
                    onMonthChange={setViewMonth}
                    className="w-full max-w-2xl" 
                    classNames={{
                        root: "w-full", 
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center h-10 mb-2",
                        caption_label: "text-xl font-orbitron accent-text",
                        nav: "space-x-1 flex items-center",
                        nav_button: cn(
                            "h-8 w-8 bg-transparent p-0 opacity-80 hover:opacity-100",
                            "rounded-md hover:bg-accent/20 text-muted-foreground hover:text-accent-foreground transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        ),
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex w-full mb-1",
                        head_cell: "text-muted-foreground rounded-md w-[14.28%] text-xs font-medium p-1 h-8 justify-center",
                        row: "flex w-full mt-2",
                        cell: "text-center text-sm p-0 relative w-[14.28%] h-16 sm:h-20 focus-within:relative focus-within:z-20",
                        day: cn(
                            "w-full h-full p-0 font-normal rounded-md",
                            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            "transition-colors"
                        ),
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary focus:text-primary-foreground",
                        day_today: "bg-accent text-accent-foreground ring-1 ring-primary/60",
                        day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                        day_disabled: "text-muted-foreground opacity-50 pointer-events-none",
                    }}
                    components={{
                        IconLeft: ({ ...props }) => <ChevronLeft {...props} className="h-5 w-5" />,
                        IconRight: ({ ...props }) => <ChevronRight {...props} className="h-5 w-5" />,
                    }}
                    formatters={{ formatDay: DayCellContent }}
                    showOutsideDays
                    fixedWeeks
                />
            </div>

            <div className="w-1/3 lg:w-1/4 bg-widget-background border border-border-main rounded-md p-4 flex flex-col space-y-4 overflow-y-auto custom-scrollbar-fullscreen">
                <Button onClick={() => { setEditingEvent(null); setShowEventForm(true); setIsPreviewingDescription(false); }} className="w-full btn-primary">
                    <PlusCircle className="w-4 h-4 mr-2"/> Add Event
                </Button>

                {showEventForm && (
                    <div className="p-3 border border-border-main rounded-md bg-input-bg/70 space-y-3">
                        <h3 className="font-orbitron text-lg accent-text">{editingEvent ? 'Edit Event' : 'New Event'}</h3>
                        <Input name="title" placeholder="Event Title" value={formData.title} onChange={handleInputChange} className="input-field" disabled={isPreviewingDescription}/>
                        <div className="flex gap-2">
                            <Input name="date" type="date" value={formData.date} onChange={handleInputChange} className="input-field" disabled={isPreviewingDescription}/>
                            <Input name="time" type="time" value={formData.time} onChange={handleInputChange} className="input-field" disabled={isPreviewingDescription}/>
                        </div>
                        <Select name="category" value={formData.category} onValueChange={handleCategoryChange} disabled={isPreviewingDescription}>
                            <SelectTrigger className="input-field"><SelectValue placeholder="Category" /></SelectTrigger>
                            <SelectContent className="bg-widget-background border-border-main">
                                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="event-description" className="text-xs text-muted-foreground">Description (Markdown)</label>
                                <div>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-6 px-1">Help</Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0 w-auto"><MarkdownCheatsheet/></PopoverContent>
                                    </Popover>
                                    <Button variant="ghost" size="icon" onClick={() => setIsPreviewingDescription(!isPreviewingDescription)} className="w-6 h-6 ml-1">
                                        {isPreviewingDescription ? <Pencil className="w-3 h-3"/> : <Eye className="w-3 h-3"/>}
                                    </Button>
                                </div>
                            </div>
                            {isPreviewingDescription ? (
                                <div className="prose prose-sm dark:prose-invert max-w-none p-2 min-h-[60px] border border-dashed border-border-main rounded-md bg-background/50">
                                    <ReactMarkdown>{formData.description || "Nothing to preview..."}</ReactMarkdown>
                                </div>
                            ) : (
                                <Textarea id="event-description" name="description" placeholder="Details... (Markdown supported)" value={formData.description || ''} onChange={handleInputChange} className="input-field min-h-[60px]"/>
                            )}
                        </div>
                        {!isPreviewingDescription && <EventRecurrenceEditor recurrence={formData.recurrenceRule} onChange={handleRecurrenceChange} startDate={formData.date}/>}
                        <div className="flex gap-2 pt-2">
                            <Button onClick={handleSubmitEvent} className="flex-grow btn-primary" disabled={isPreviewingDescription}>{editingEvent ? 'Save Changes' : 'Add Event'}</Button>
                            <Button variant="outline" onClick={resetForm} className="border-border-main text-muted-foreground hover:bg-background">Cancel</Button>
                        </div>
                    </div>
                )}

                {!showEventForm && selectedDate && (
                    <div>
                        <h3 className="font-orbitron text-lg accent-text mb-2">
                            Events for: {format(selectedDate, 'MMM d, yyyy')}
                        </h3>
                        {eventsForSelectedDay.length > 0 ? (
                            <ul className="space-y-2">
                                {eventsForSelectedDay.map((event, idx) => ( 
                                    <li key={`${event.id}-${idx}`} className="p-2.5 bg-input-bg/70 border border-border-main rounded-md">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-sm text-foreground">{event.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {format(parseISO(event.date), 'p')} - {event.category}
                                                    {event.recurrenceRule && <Repeat className="w-3 h-3 inline ml-1.5 text-muted-foreground/70"/>}
                                                </p>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <Button variant="ghost" size="icon" onClick={() => { setEditingEvent(events.find(e=>e.id === event.id) || event) }} className="btn-icon w-6 h-6"><Edit className="w-3.5 h-3.5"/></Button>
                                                <Button variant="ghost" size="icon" onClick={() => onDeleteEvent(event.id)} className="btn-icon danger w-6 h-6"><Trash2 className="w-3.5 h-3.5"/></Button>
                                            </div>
                                        </div>
                                        {event.description && (
                                            <div className="prose prose-sm dark:prose-invert max-w-none mt-1 pt-1 border-t border-border-main/50 text-foreground">
                                               <ReactMarkdown>{event.description}</ReactMarkdown>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">No events for this day.</p>
                        )}
                    </div>
                )}
                 {!showEventForm && !selectedDate && (
                    <p className="text-sm text-muted-foreground text-center py-4">Select a date to see events.</p>
                )}
            </div>
        </div>
    </div>
  );
}

```

## src/middleware.ts

```
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow requests for NextAuth session & provider, API routes, static files, and public pages
  if (
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.png') ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/landing' ||
    pathname.startsWith('/api/ai') || // Assuming AI endpoint is public or handles its own auth
    pathname.startsWith('/api/events') || // Assuming these are fine or have their own auth
    pathname.startsWith('/api/goals') ||
    pathname.startsWith('/api/notes') ||
    pathname.startsWith('/api/projects') ||
    pathname.startsWith('/api/tasks')
  ) {
    return NextResponse.next();
  }

  // If no token and trying to access a protected route (e.g., dashboard at root)
  if (!token && pathname === '/') {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.url); // Pass current URL as callback
    return NextResponse.redirect(loginUrl);
  }

  // If there's a token, or it's a public path not yet handled, allow access
  return NextResponse.next();
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth (NextAuth routes)
     * - landing, login, register (public pages)
     *
     * This will apply middleware to `/` (dashboard) and other potential protected routes.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth|landing|login|register).*)',
  ],
};

```

## src/models/EventModel.ts

```
import mongoose, { Document, Model, Schema } from 'mongoose';
import { Event as EventType, RecurrenceRule } from '@/types';

export interface IEvent extends EventType, Document {}

const RecurrenceRuleSchema = new Schema<RecurrenceRule>({
  type: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], required: true },
  interval: { type: Number, required: true, min: 1 },
  daysOfWeek: { type: [Number], required: false },
  dayOfMonth: { type: Number, required: false },
  monthOfYear: { type: Number, required: false },
  endDate: { type: String, required: false },
  count: { type: Number, required: false },
}, { _id: false });

const EventSchema: Schema<IEvent> = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true }, // Added
    title: { type: String, required: true },
    date: { type: String, required: true }, // ISO string
    duration: { type: Number, required: false }, // in minutes
    description: { type: String, required: false },
    category: { type: String, required: true },
    recurrenceRule: { type: RecurrenceRuleSchema, required: false },
  },
  {
    timestamps: true,
  }
);

const EventModel: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default EventModel;


```

## src/models/GoalModel.ts

```
import mongoose, { Document, Model, Schema } from 'mongoose';
import { Goal as GoalType } from '@/types';

export interface IGoal extends GoalType, Document {}

const GoalSchema: Schema<IGoal> = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true }, // Added
    name: { type: String, required: true },
    currentValue: { type: Number, required: true, default: 0 },
    targetValue: { type: Number, required: true },
    unit: { type: String, required: true },
    category: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const GoalModel: Model<IGoal> = mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema);

export default GoalModel;


```

## src/models/NoteModel.ts

```
import mongoose, { Document, Model, Schema } from 'mongoose';
import { Note as NoteType } from '@/types';

export interface INote extends NoteType, Document {}

const NoteSchema: Schema<INote> = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true }, // Added
    title: { type: String, required: false },
    content: { type: String, required: true },
    category: { type: String, required: true },
    lastEdited: { type: String, required: true }, // ISO string
  },
  {
    timestamps: true, // Will add createdAt, updatedAt. lastEdited is specific.
  }
);

const NoteModel: Model<INote> = mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);

export default NoteModel;


```

## src/models/TaskModel.ts

```
import mongoose, { Document, Model, Schema } from 'mongoose';
import { Task as TaskType, RecurrenceRule, SubTask } from '@/types';

export interface ITask extends TaskType, Document {}

const RecurrenceRuleSchema = new Schema<RecurrenceRule>({
  type: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], required: true },
  interval: { type: Number, required: true, min: 1 },
  daysOfWeek: { type: [Number], required: false },
  dayOfMonth: { type: Number, required: false },
  monthOfYear: { type: Number, required: false },
  endDate: { type: String, required: false },
  count: { type: Number, required: false },
}, { _id: false });

const SubTaskSchema = new Schema<SubTask>({
  id: { type: String, required: true }, // UUID generated on client/server
  text: { type: String, required: true },
  completed: { type: Boolean, required: true, default: false },
}, { _id: false });

const TaskSchema: Schema<ITask> = new Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true }, // Added
    text: { type: String, required: true },
    completed: { type: Boolean, required: true, default: false },
    dueDate: { type: String, required: false }, // YYYY-MM-DD format
    category: { type: String, required: true },
    recurrenceRule: { type: RecurrenceRuleSchema, required: false },
    subTasks: { type: [SubTaskSchema], required: false, default: [] },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const TaskModel: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default TaskModel;



```

## src/models/UserModel.ts

```
import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  id: string;
  email: string;
  name?: string;
  passwordHash: string;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, trim: true },
    passwordHash: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password (only if modified or new)
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    return next();
  } catch (error) {
    return next(error as Error);
  }
});

UserSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;

```

## src/components/icons.tsx

```typescript
// This file can be used to re-export commonly used icons
// For this project, we'll import directly from lucide-react in components
// to keep it simpler for this specific output.
// If you had many icons, creating a dedicated file like this would be good practice.

// Example (not used directly in this solution, but shows the pattern):
/*
export {
  UserCircle2,
  Lock,
  Send,
  MoreHorizontal,
  Edit,
  Trash2,
  X,
  CheckSquare,
  Square,
  ChevronDown,
  CalendarDays,
  ListChecks,
  Target,
  StickyNote,
  PlusCircle,
  GripVertical,
  Bell,
  Search
} from 'lucide-react';
*/

// We will import lucide-react icons directly in the components that use them.
// e.g. import { UserCircle2 } from 'lucide-react';
export {};

```

## src/components/landing/FeaturesSection.tsx

```typescript
import React from 'react';
import { CheckCircle, Brain, Zap, CalendarDays, ListChecks, Target, StickyNote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: <Brain className="w-10 h-10 accent-text mb-4" />,
    title: 'AI-Powered Assistance',
    description: 'Leverage generative AI to quickly add tasks, notes, goals, and events using natural language commands.',
  },
  {
    icon: <ListChecks className="w-10 h-10 accent-text mb-4" />,
    title: 'Task Management',
    description: 'Organize your to-dos, set due dates, categorize tasks by project, and track your progress efficiently.',
  },
  {
    icon: <Target className="w-10 h-10 accent-text mb-4" />,
    title: 'Goal Tracking',
    description: 'Define your personal and professional goals, set targets, and monitor your achievements over time.',
  },
  {
    icon: <StickyNote className="w-10 h-10 accent-text mb-4" />,
    title: 'Quick Notes',
    description: 'Jot down ideas, reminders, and important information with an easy-to-use notes system.',
  },
  {
    icon: <CalendarDays className="w-10 h-10 accent-text mb-4" />,
    title: 'Event Scheduling',
    description: 'Keep track of your appointments, meetings, and important dates with an integrated calendar.',
  },
  {
    icon: <Zap className="w-10 h-10 accent-text mb-4" />,
    title: 'Unified Dashboard',
    description: 'Get a comprehensive overview of your upcoming tasks, events, goal progress, and recent notes all in one place.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-[var(--widget-background-val)]">
      <div className="container mx-auto px-6">
        <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-center mb-4">
          Why <span className="accent-text">AYANDA</span>?
        </h2>
        <p className="text-lg text-[var(--text-muted-color-val)] text-center mb-12 md:mb-16 max-w-2xl mx-auto">
          AYANDA brings clarity and control to your busy life. Focus on what matters most with our intuitive and powerful features.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-[var(--input-bg-val)] border-[var(--border-color-val)] hover:border-[var(--accent-color-val)]/50 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <CardHeader className="items-center">
                {feature.icon}
                <CardTitle className="font-orbitron text-xl text-center accent-text">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[var(--text-muted-color-val)] text-center text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

```

## src/components/landing/HeroSection.tsx

```typescript
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AyandaLogoIcon } from '@/components/layout/AyandaLogoIcon'; // Ensure path is correct
import { cn } from '@/lib/utils';

export function HeroSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-[var(--background-color-val)] to-[var(--widget-background-val)] text-center">
      <div className="container mx-auto px-6">
        <AyandaLogoIcon className="w-20 h-20 mx-auto mb-8 animate-pulse" />
        <h1 className="font-orbitron text-5xl md:text-7xl font-bold mb-6">
          Meet <span className="accent-text">AYANDA</span>
        </h1>
        <p className="text-xl md:text-2xl text-[var(--text-muted-color-val)] mb-10 max-w-3xl mx-auto">
          Your intelligent personal assistant and dashboard, designed to streamline your tasks, goals, notes, and events with the power of AI.
        </p>
        <div className="space-x-4">
          <Link href="/register" legacyBehavior>
            <Button size="lg" className="btn-primary text-lg px-8 py-6">
              Get Started Free
            </Button>
          </Link>
          <Link href="#features" legacyBehavior>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-[var(--accent-color-val)] text-[var(--accent-color-val)] hover:bg-[var(--accent-color-val)]/10 hover:text-[var(--accent-color-val)]">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

```

## src/components/ui/button.tsx

```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

```

## src/components/ui/calendar.tsx

```typescript
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}

export { Calendar }

```

## src/components/ui/card.tsx

```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}

```

## src/components/ui/checkbox.tsx

```typescript
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }

```

## src/components/ui/dropdown-menu.tsx

```typescript
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}

```

## src/components/ui/input.tsx

```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }

```

## src/components/ui/popover.tsx

```typescript
"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

function Popover({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverAnchor({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  collisionPadding = 8,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "z-[100]", // Increased z-index to ensure it's above other fixed elements like ProjectSelectorBar (z-[90]) and FooterChat (z-[98])
          "max-h-(--radix-popover-content-available-height) w-72 origin-(--radix-popover-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-4 shadow-md outline-none",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
```

## src/components/ui/progress.tsx

```typescript
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }

```

## src/components/ui/select.tsx

```typescript
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & { size?: "sm" | "default" }
>(({ className, children, size = "default", ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    data-slot="select-trigger"
    data-size={size}
    className={cn(
      "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDownIcon className="size-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      data-slot="select-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    data-slot="select-label"
    className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    data-slot="select-item"
    className={cn(
      "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex size-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    data-slot="select-separator"
    className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    data-slot="select-scroll-up-button"
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUpIcon className="size-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    data-slot="select-scroll-down-button"
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDownIcon className="size-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
```

## src/components/ui/textarea.tsx

```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

```

## src/components/auth/AuthSessionProvider.tsx

```typescript
"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

interface AuthSessionProviderProps {
  children: React.ReactNode;
}

export default function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}

```

## src/components/dashboard/AiAssistantWidget.tsx

```typescript
"use client";

import React from 'react';
import { Star, Info } from 'lucide-react'; // Using Lucide Star
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { cn } from '@/lib/utils';

interface AiAssistantWidgetProps {
  message: string | null; // Message from AI, or null for default
  // type?: 'info' | 'success' | 'error' | 'suggestion'; // Could be used for icon/color later
}

const DEFAULT_MESSAGE = "Hi there! How can I help you make the most of your day?";

export function AiAssistantWidget({ message }: AiAssistantWidgetProps) {
  const displayMessage = message || DEFAULT_MESSAGE;

  // const getIconForType = () => { // Example if we add type later
  //   switch (type) {
  //     case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
  //     default: return <Info className="w-5 h-5 accent-text" />;
  //   }
  // };

  return (
    <DashboardCardWrapper
      title="AIDA" // AI Name
      icon={<Star className="w-5 h-5 accent-text" />} // Star Icon
      allowExpand={false} // This widget likely doesn't need an expand view
      id="ai-assistant-widget"
      className="min-h-[120px] lg:min-h-[140px]" // Explicitly shorter height than other widgets
      contentClassName="!p-3 flex items-center" // Adjusted padding for content
    >
      <div className="flex items-start gap-2.5">
        {/* Optional: Icon based on message type could go here */}
        {/* <div className="shrink-0 mt-0.5">{getIconForType()}</div> */}
        <p className="text-sm text-[var(--text-color-val)] leading-relaxed">
          {displayMessage}
        </p>
      </div>
    </DashboardCardWrapper>
  );
}

```

## src/components/dashboard/CalendarWidget.ts

```
"use client"; 

import React, { useState, useEffect } from 'react';
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { Calendar } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';
import { Event as AppEvent } from '@/types';

interface CalendarWidgetProps {
  events: AppEvent[];
  onNavigate: () => void;
}

// Helper component to render day cell with potential event dot
const DayCell = ({ date, events, dayHasEvents }: { date: Date | undefined; events: AppEvent[]; dayHasEvents: (date: Date, allEvents: AppEvent[]) => boolean }) => {
  if (!date) return null; // Handle case where date might be undefined (though Calendar usually provides it)

  const hasEvent = dayHasEvents(date, events);
  return (
    <>
      {date.getDate()} {/* This is the number of the day */}
      {hasEvent && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[var(--accent-color-val)]/80 rounded-full"></span>
      )}
    </>
  );
};


export function CalendarWidget({ events, onNavigate }: CalendarWidgetProps) {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [currentMonthForTitle, setCurrentMonthForTitle] = useState('');

  useEffect(() => {
    const dateToUse = selectedDay || new Date();
    setCurrentMonthForTitle(dateToUse.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase());
  }, [selectedDay]);

  const dayHasEvents = (date: Date, allEvents: AppEvent[]): boolean => {
    if (!date || !Array.isArray(allEvents)) return false;
    return allEvents.some(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === date.getFullYear() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getDate() === date.getDate();
    });
  };

  return (
    <DashboardCardWrapper 
        title={currentMonthForTitle}
        onNavigate={onNavigate} 
        id="calendar-widget-summary"
        className="min-h-[280px] lg:min-h-[300px] flex flex-col"
        contentClassName="!p-2 flex flex-col flex-grow items-center justify-center"
    >
      <Calendar
        mode="single"
        selected={selectedDay}
        onSelect={setSelectedDay}
        month={selectedDay || new Date()}
        className="p-0 w-full max-w-[260px]"
        classNames={{
          months: "flex flex-col items-center",
          month: "space-y-2 w-full px-1",
          caption: "flex justify-center pt-0.5 relative items-center text-sm mb-1",
          caption_label: "text-sm font-medium accent-text sr-only",
          nav: "space-x-1",
          nav_button: "h-6 w-6 p-0 opacity-0 cursor-default",
          
          table: "w-full border-collapse",
          head_row: "flex w-full justify-around mb-1",
          head_cell: cn(
            "text-[var(--text-muted-color-val)] rounded-md",
            "flex items-center justify-center font-normal text-[0.75rem] p-0",
            "h-7 w-full max-w-[2.25rem]"
          ),
          row: "flex w-full mt-1 justify-around",
          cell: cn(
            "text-center p-0 relative focus-within:relative focus-within:z-20 rounded-md",
            "flex flex-col items-center justify-center",
            "h-9 w-full max-w-[2.25rem]" 
          ),
          day: cn(
            "h-full w-full p-0 font-normal aria-selected:opacity-100 rounded-md",
            "hover:bg-[var(--accent-color-val)]/10 flex items-center justify-center relative text-xs sm:text-sm"
          ),
          day_selected: "bg-[var(--accent-color-val)] text-[var(--background-color-val)] hover:bg-[var(--accent-color-val)] hover:text-[var(--background-color-val)] focus:bg-[var(--accent-color-val)] focus:text-[var(--background-color-val)]",
          day_today: "ring-1 ring-[var(--accent-color-val)]/60 text-[var(--accent-color-val)] rounded-md font-semibold",
          day_outside: "text-[var(--text-muted-color-val)]/40 opacity-40",
          day_disabled: "text-[var(--text-muted-color-val)]/30 opacity-30",
        }}
        formatters={{
            // Pass the date to the DayCell formatter.
            // The `date` parameter provided by `formatDay` here is the one we need.
            formatDay: (date) => <DayCell date={date} events={events} dayHasEvents={dayHasEvents} />,
        }}
        showOutsideDays={true}
        numberOfMonths={1}
        disableNavigation
        fixedWeeks
      />
    </DashboardCardWrapper>
  );
}


```

## src/components/dashboard/CalendarWidget.tsx

```typescript
"use client"; 

import React, { useState, useEffect, useCallback } from 'react';
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar"; // Renamed to avoid conflict
import { cn } from '@/lib/utils';
import { Event as AppEvent } from '@/types';
import { format, parseISO, startOfDay, addDays, isSameDay } from 'date-fns';

interface CalendarWidgetProps {
  events: AppEvent[];
  onNavigate: () => void;
}

const getNextOccurrenceForCalendarDot = (event: AppEvent, day: Date): boolean => {
    if (!event.recurrenceRule) {
      return isSameDay(parseISO(event.date), day);
    }
  
    const rule = event.recurrenceRule;
    let baseEventDate = startOfDay(parseISO(event.date));
    let currentDay = startOfDay(day);
  
    if (baseEventDate > currentDay) return false; // Recurrence hasn't started yet for this day
    if (rule.endDate && currentDay > startOfDay(parseISO(rule.endDate))) return false; // Recurrence ended
  
    switch (rule.type) {
      case 'daily':
        const diffDays = Math.floor((currentDay.getTime() - baseEventDate.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays % rule.interval === 0;
      case 'weekly':
        if (!rule.daysOfWeek?.includes(currentDay.getDay())) return false;
        // Check if it's a valid week in the interval
        const weekDiff = Math.floor((currentDay.getTime() - baseEventDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
        // This check is simplified; a full rrule lib would be better for complex weekly intervals
        // For simple "every X weeks on day Y", this might work if baseEventDate was also on day Y.
        // A more robust check needed for "every X weeks" if base date isn't on the target day.
        // For this widget, we'll assume a match if the day of week matches and it's on or after base.
        return true; // Simplified for widget
      case 'monthly':
        // Check if the day of the month matches the original event's day of month
        // And if the month interval matches
        if (currentDay.getDate() !== baseEventDate.getDate()) return false;
        const monthDiff = (currentDay.getFullYear() - baseEventDate.getFullYear()) * 12 + (currentDay.getMonth() - baseEventDate.getMonth());
        return monthDiff >= 0 && monthDiff % rule.interval === 0;
      case 'yearly':
        if (currentDay.getDate() !== baseEventDate.getDate() || currentDay.getMonth() !== baseEventDate.getMonth()) return false;
        const yearDiff = currentDay.getFullYear() - baseEventDate.getFullYear();
        return yearDiff >= 0 && yearDiff % rule.interval === 0;
      default:
        return false;
    }
};

const DayCell = ({ date, events }: { date: Date; events: AppEvent[]; }) => {
  const displayDate = date.getDate();
  const showDot = events.some(event => getNextOccurrenceForCalendarDot(event, date));
  return (
    <>
      {displayDate}
      {showDot ? <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary/80 rounded-full" /> : null}
    </>
  );
};

export function CalendarWidget({ events, onNavigate }: CalendarWidgetProps) {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [currentMonthForTitle, setCurrentMonthForTitle] = useState('');

  useEffect(() => {
    const dateToUse = selectedDay || new Date();
    setCurrentMonthForTitle(format(dateToUse, 'MMMM yyyy').toUpperCase());
  }, [selectedDay]);

  return (
    <DashboardCardWrapper 
        title={currentMonthForTitle}
        onNavigate={onNavigate} 
        id="calendar-widget-summary"
        className="min-h-[280px] lg:min-h-[300px] flex flex-col"
        contentClassName="!p-2 flex flex-col flex-grow items-center justify-center"
    >
      <ShadcnCalendar
        mode="single"
        selected={selectedDay}
        onSelect={setSelectedDay}
        month={selectedDay || new Date()}
        className="p-0 w-full" 
        classNames={{
          months: "flex flex-col items-center",
          month: "space-y-2 w-full", 
          caption: "flex justify-center pt-0.5 relative items-center text-sm mb-1",
          caption_label: "text-sm font-medium accent-text sr-only",
          nav: "space-x-1",
          nav_button: "h-6 w-6 p-0 opacity-0 cursor-default",
          table: "w-full border-collapse", 
          head_row: "flex w-full", 
          head_cell: cn(
            "text-muted-foreground rounded-md",
            "flex items-center justify-center font-normal text-[0.75rem] p-0",
            "h-7 flex-1 basis-0" 
          ),
          row: "flex w-full mt-1", 
          cell: cn(
            "text-center p-0 relative focus-within:relative focus-within:z-20 rounded-md",
            "flex flex-col items-center justify-center",
            "h-9 flex-1 basis-0" 
          ),
          day: cn(
            "h-full w-full p-0 font-normal aria-selected:opacity-100 rounded-md",
            "hover:bg-accent/10 flex items-center justify-center relative text-xs sm:text-sm"
          ),
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "ring-1 ring-primary/60 text-primary rounded-md font-semibold",
          day_outside: "text-muted-foreground/40 opacity-40",
          day_disabled: "text-muted-foreground/30 opacity-30",
        }}
        formatters={{
            formatDay: (date) => <DayCell date={date} events={events} />,
        }}
        showOutsideDays={true}
        numberOfMonths={1}
        disableNavigation
        fixedWeeks
      />
    </DashboardCardWrapper>
  );
}

```

## src/components/dashboard/DashboardCardWrapper.tsx

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

// Expand icon SVG from the target HTML
const ExpandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
  </svg>
);

interface DashboardCardWrapperProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode; // Optional icon for the title
  className?: string;
  contentClassName?: string;
  onNavigate?: () => void; 
  id?: string; 
  allowExpand?: boolean; 
}

export function DashboardCardWrapper({ 
  title, 
  children, 
  icon,
  className, 
  contentClassName, 
  onNavigate, 
  id,
  allowExpand = true 
}: DashboardCardWrapperProps) {
  const handleCardClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div 
      id={id}
      className={cn(
        "bg-[var(--widget-background-val)] border border-[var(--border-color-val)]",
        "shadow-[0_4px_15px_rgba(0,0,0,0.2)] rounded-[0.75rem]", 
        "flex flex-col",
        "transition-transform duration-200 ease-out hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(0,220,255,0.07)]", 
        onNavigate && allowExpand === false ? "cursor-pointer" : "", 
        className
      )}
      onClick={onNavigate && allowExpand === false ? handleCardClick : undefined} 
    >
      <div className={cn(
        "border-b border-[var(--border-color-val)]",
        "px-4 py-3", 
        "mb-3", 
        "flex justify-between items-center"
      )}>
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-orbitron text-lg accent-text">{title}</h2>
        </div>
        {allowExpand && onNavigate && (
          <button 
            onClick={handleExpandClick} 
            className="p-0 bg-transparent border-none text-[var(--text-muted-color-val)] hover:accent-text" 
            title={`Expand ${title}`}
            aria-label={`Expand ${title}`}
          >
            <ExpandIcon />
          </button>
        )}
      </div>

      <div className={cn(
        "flex-grow overflow-y-auto", 
        "px-4 pb-3", 
        "widget-content-summary-scrollbars", 
        contentClassName
      )}>
        {children}
      </div>
    </div>
  );
}


```

## src/components/dashboard/DueSoonWidget.tsx

```typescript
import React from 'react';
import { Task, Event as AppEvent } from '@/types';
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { cn } from '@/lib/utils';
import { format, parseISO, addDays, startOfDay, isSameDay, isTomorrow as dateFnsIsTomorrow } from 'date-fns';

// Helper to get next occurrence for summary
const getNextOccurrenceForSummary = (item: Task | AppEvent, fromDate: Date = new Date()): Date | null => {
  const baseItemDate = item.dueDate ? parseISO(item.dueDate) : parseISO(item.date); // Task has dueDate, Event has date
  if (!item.recurrenceRule) {
    return startOfDay(baseItemDate) >= startOfDay(fromDate) ? baseItemDate : null;
  }

  const rule = item.recurrenceRule;
  let checkDate = startOfDay(baseItemDate); // Start from the item's original start date/time
  
  if (checkDate >= startOfDay(fromDate)) {
     // If rule is weekly, check if baseDate's day is in daysOfWeek, if not, find first valid day from baseDate
     if(rule.type === 'weekly' && rule.daysOfWeek && rule.daysOfWeek.length > 0 && !rule.daysOfWeek.includes(checkDate.getDay())) {
        // Find next valid day based on rule starting from checkDate
        for(let i = 0; i < 7; i++) { // Check next 7 days
            let futureDay = addDays(checkDate, i);
            if(rule.daysOfWeek.includes(futureDay.getDay())) {
                if(rule.endDate && futureDay > parseISO(rule.endDate)) return null;
                return futureDay;
            }
        }
        // If no day found in current week, it means we need to advance to next interval. Handled by loop below.
     } else {
        if(rule.endDate && checkDate > parseISO(rule.endDate)) return null;
        return checkDate; // Base date itself is a valid upcoming or current occurrence
     }
  }
  
  // Search for next occurrence after fromDate
  for(let i=0; i < (rule.count || 365); i++) { // Limit search
      let next: Date;
      switch(rule.type) {
          case 'daily': 
              next = addDays(checkDate, rule.interval * (i + (startOfDay(checkDate) < startOfDay(fromDate) ? 1 : 0) ) ); // ensure we are looking forward
              break;
          case 'weekly':
              next = addDays(checkDate, (rule.interval * 7 * (i + (startOfDay(checkDate) < startOfDay(fromDate) ? 1 : 0) ) ));
              if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
                  let currentDay = next.getDay();
                  let targetDay = rule.daysOfWeek.find(d => d >= currentDay) ?? rule.daysOfWeek[0];
                  let diff = targetDay - currentDay;
                  if (diff < 0) { // Target day passed for this iteration
                      next = addDays(next, (7 - currentDay) + targetDay); // Go to next week's target day
                  } else {
                      next = addDays(next, diff);
                  }
              }
              break;
          case 'monthly': next = add(checkDate, { months: rule.interval * (i + (startOfDay(checkDate) < startOfDay(fromDate) ? 1 : 0) ) }); break;
          case 'yearly': next = add(checkDate, { years: rule.interval * (i + (startOfDay(checkDate) < startOfDay(fromDate) ? 1 : 0) ) }); break;
          default: return null;
      }
      next = startOfDay(next);

      if(next >= startOfDay(fromDate)) {
          if (rule.endDate && next > startOfDay(parseISO(rule.endDate))) return null;
          return next;
      }
      checkDate = next; // Update checkDate for next iteration, ensures we move forward from the found date
  }
  return null;
};


interface DueSoonWidgetProps {
  tasks?: Task[];
  events?: AppEvent[];
  currentProjectId: string | null;
  onNavigateToItem: (type: 'tasks' | 'calendar', id: string) => void;
}

export function DueSoonWidget({ tasks = [], events = [], currentProjectId, onNavigateToItem }: DueSoonWidgetProps) {
  const upcomingItems: { type: 'Task' | 'Event'; name: string; date: Date; id: string; isToday: boolean; isTomorrow: boolean; originalCategory: string; }[] = [];
  const today = startOfDay(new Date());
  const tomorrow = startOfDay(addDays(today, 1));
  const endOfThreeDays = startOfDay(addDays(today, 3)); // Include today, tomorrow, and day after tomorrow

  const processItems = <T extends Task | AppEvent>(
    items: T[],
    itemType: 'Task' | 'Event'
  ) => {
    items
      .filter(item => {
        if (itemType === 'Task' && (item as Task).completed) return false;
        return (currentProjectId === null || item.category === currentProjectId);
      })
      .forEach(item => {
        const itemDateStr = itemType === 'Task' ? (item as Task).dueDate : (item as AppEvent).date;
        if (!itemDateStr) return;

        let nextOccurrenceDate = getNextOccurrenceForSummary(item, today);
        
        if (nextOccurrenceDate && nextOccurrenceDate < endOfThreeDays) {
          upcomingItems.push({
            type: itemType,
            name: itemType === 'Task' ? (item as Task).text : (item as AppEvent).title,
            date: nextOccurrenceDate,
            id: item.id,
            isToday: isSameDay(nextOccurrenceDate, today),
            isTomorrow: dateFnsIsTomorrow(nextOccurrenceDate),
            originalCategory: item.category,
          });
        }
      });
  };

  if (Array.isArray(tasks)) processItems(tasks, 'Task');
  if (Array.isArray(events)) processItems(events, 'Event');
  
  // Deduplicate if recurring item's next occurrence is same as another unique item on same day
  const uniqueUpcomingItems = upcomingItems.filter((item, index, self) =>
    index === self.findIndex((t) => (
      t.id === item.id && t.type === item.type && t.date.getTime() === item.date.getTime()
    ))
  );


  uniqueUpcomingItems.sort((a, b) => a.date.getTime() - b.date.getTime());
  const displayedItems = uniqueUpcomingItems.slice(0, 5); // Show up to 5

  return (
    <DashboardCardWrapper 
        title="DUE SOON" 
        allowExpand={false} // This widget summarizes, click items to navigate
        className="lg:col-span-2" // Assuming it takes more space
        id="due-soon-widget-summary"
        contentClassName="space-y-2"
    >
      {displayedItems.length > 0 ? (
        <ul className="space-y-2">
          {displayedItems.map(item => {
            let dateString = format(item.date, 'EEE, MMM d');
            if (item.isToday) dateString = "Today";
            else if (item.isTomorrow) dateString = "Tomorrow";
            
            return (
              <li 
                key={`${item.type}-${item.id}-${item.date.toISOString()}`} 
                className={cn(
                  "widget-item cursor-pointer", // Make it clickable
                  item.isToday ? "bg-amber-500/10 !border-l-amber-400" : "!border-l-sky-400/50"
                )}
                onClick={() => onNavigateToItem(item.type === 'Task' ? 'tasks' : 'calendar', item.id)}
                title={`${item.type}: ${item.name} - ${dateString} (${item.originalCategory})`}
              >
                <div className="flex justify-between items-center">
                    <p className="text-sm truncate flex-grow" >{item.type}: {item.name}</p>
                    <p className="text-xs text-muted-foreground shrink-0 ml-2">{dateString}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground p-2 text-center">Nothing due in the next 3 days.</p>
      )}
    </DashboardCardWrapper>
  );
}

```

## src/components/dashboard/GoalsWidget.tsx

```typescript
import React from 'react';
import { Goal } from '@/types';
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { cn } from '@/lib/utils';

interface GoalsWidgetProps {
  goals: Goal[]; // Pre-filtered goals
  onNavigate: () => void;
}

export function GoalsWidget({ goals, onNavigate }: GoalsWidgetProps) {
  const displayedGoals = goals.slice(0, 3); // Show max 3 in summary

  return (
    <DashboardCardWrapper 
        title="GOALS" 
        onNavigate={onNavigate} 
        id="goals-widget-summary"
        contentClassName="space-y-3" // space-y from target
    >
      {displayedGoals.length > 0 ? (
        <ul className="space-y-3"> {/* Added ul for semantics */}
          {displayedGoals.map((goal) => {
            const percentage = goal.targetValue > 0 ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100)) : 0;
            return (
              <li key={goal.id} className="widget-item"> {/* widget-item class */}
                <p className="text-sm truncate" title={goal.name}>
                  {goal.name} - <span className="font-semibold accent-text">{percentage}%</span>
                </p>
                <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1.5">
                  <div 
                    className="bg-[var(--accent-color-val)] h-1.5 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-[var(--text-muted-color-val)] p-2">No goals set.</p>
      )}
    </DashboardCardWrapper>
  );
}

```

## src/components/dashboard/QuickNotesWidget.tsx

```typescript
import React from 'react';
import { Note } from '@/types';
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { cn } from '@/lib/utils';

interface QuickNotesWidgetProps {
  notes: Note[]; // Pre-filtered and sorted notes
  onNavigate: () => void;
}

export function QuickNotesWidget({ notes, onNavigate }: QuickNotesWidgetProps) {
  const displayedNotes = notes.slice(0, 3); // Show max 3 in summary

  return (
    <DashboardCardWrapper 
        title="QUICK NOTES" 
        onNavigate={onNavigate} 
        id="notes-widget-summary"
        contentClassName="space-y-2" // space-y from target
    >
      {displayedNotes.length > 0 ? (
         <ul className="space-y-2"> {/* Added ul for semantics */}
          {displayedNotes.map((note) => (
            <li key={note.id} className="widget-item"> {/* widget-item class */}
              <p className="font-medium text-sm truncate" title={note.title || 'Untitled Note'}>
                {note.title || 'Untitled Note'}
              </p>
              <p className="text-xs text-[var(--text-muted-color-val)] truncate">
                {note.content.substring(0, 60)}{note.content.length > 60 ? '...' : ''}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--text-muted-color-val)] p-2">No notes available.</p>
      )}
    </DashboardCardWrapper>
  );
}

```

## src/components/dashboard/TasksWidget.tsx

```typescript
import React, { useState } from 'react';
import { Task, SubTask } from '@/types';
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';

interface TasksWidgetProps {
  tasks: Task[];
  onTaskToggle: (taskId: string, subTaskId?: string) => void; // Modified to handle subtask toggle
  onNavigate: () => void;
  className?: string;
}

export function TasksWidget({ tasks, onTaskToggle, onNavigate, className }: TasksWidgetProps) {
  const displayedTasks = tasks.filter(t => !t.completed).slice(0, 10); 
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  const toggleExpand = (taskId: string) => {
    setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  return (
    <DashboardCardWrapper 
        title="TASKS" 
        onNavigate={onNavigate} 
        className={cn(
            "flex flex-col", 
            className 
        )} 
        id="tasks-widget-summary"
        contentClassName="space-y-2 flex-grow" 
    >
      {displayedTasks.length > 0 ? (
        <ul className="space-y-1.5">
          {displayedTasks.map((task) => (
            <li 
              key={task.id} 
              className={cn(
                "widget-item !p-2.5", // Adjusted padding
                "flex flex-col" // Allow subtasks to stack
              )}
            >
              <div className="flex justify-between items-center w-full">
                <Checkbox
                  id={`task-widget-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => onTaskToggle(task.id)}
                  className={cn(
                    "form-checkbox h-4 w-4 shrink-0 mr-2.5",
                    "border-[var(--text-muted-color-val)] rounded",
                    "focus:ring-offset-0 focus:ring-1 focus:ring-[var(--accent-color-val)]",
                    "data-[state=checked]:bg-[var(--accent-color-val)] data-[state=checked]:border-[var(--accent-color-val)] data-[state=checked]:text-[var(--background-color-val)]"
                  )}
                  aria-label={`Mark task ${task.text} as ${task.completed ? 'incomplete' : 'complete'}`}
                />
                <span 
                  className="overflow-hidden text-ellipsis whitespace-nowrap flex-grow cursor-pointer text-sm" 
                  title={task.text}
                  onClick={onNavigate} // Navigate when text is clicked too
                >
                  {task.text}
                </span>
                {task.subTasks && task.subTasks.length > 0 && (
                   <Button variant="ghost" size="icon" onClick={() => toggleExpand(task.id)} className="ml-1 w-6 h-6 p-0 shrink-0 text-muted-foreground hover:text-accent-foreground">
                     {expandedTasks[task.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                   </Button>
                )}
              </div>
              {expandedTasks[task.id] && task.subTasks && task.subTasks.length > 0 && (
                <ul className="mt-1.5 pl-6 space-y-1">
                  {task.subTasks.map((sub) => (
                    <li key={sub.id} className="flex items-center text-xs">
                       <Checkbox
                          id={`subtask-widget-${task.id}-${sub.id}`}
                          checked={sub.completed}
                          onCheckedChange={() => onTaskToggle(task.id, sub.id)} // Pass sub.id
                          className={cn(
                            "form-checkbox h-3.5 w-3.5 shrink-0 mr-2",
                            "border-[var(--text-muted-color-val)]/70 rounded-[3px]",
                            "focus:ring-offset-0 focus:ring-1 focus:ring-[var(--accent-color-val)]",
                            "data-[state=checked]:bg-[var(--accent-color-val)]/80 data-[state=checked]:border-[var(--accent-color-val)]/80 data-[state=checked]:text-[var(--background-color-val)]"
                          )}
                          aria-label={`Mark subtask ${sub.text} as ${sub.completed ? 'incomplete' : 'complete'}`}
                        />
                      <span className={cn("text-muted-foreground", sub.completed && "line-through opacity-70")}>{sub.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--text-muted-color-val)] p-2 text-center">No active tasks.</p>
      )}
    </DashboardCardWrapper>
  );
}



```

## src/components/views/CalendarFullScreenView.tsx

```typescript
"use client"; 

import React, { useState, useEffect, useCallback, useMemo } from 'react'; // Added useMemo
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Event as AppEvent, Category, RecurrenceRule } from '@/types';
import { cn } from '@/lib/utils';
import { X, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight, Repeat, Eye, Pencil } from 'lucide-react';
import { DateFormatter } from "react-day-picker"; 
import { format, parseISO, isValid as isValidDate, add, startOfDay } from 'date-fns';
import ReactMarkdown from 'react-markdown';

const MarkdownCheatsheet: React.FC = () => (
  <div className="p-3 text-xs space-y-1 text-muted-foreground bg-popover border border-border rounded-md shadow-md w-64">
    <p><strong># H1</strong>, <strong>## H2</strong>, <strong>### H3</strong></p>
    <p><strong>**bold**</strong> or __bold__</p>
    <p><em>*italic*</em> or _italic_</p>
    <p>~<sub>~</sub>Strikethrough~<sub>~</sub></p>
    <p>Unordered List: <br />- Item 1<br />- Item 2</p>
    <p>Ordered List: <br />1. Item 1<br />2. Item 2</p>
    <p>Checklist: <br />- [ ] To do<br />- [x] Done</p>
    <p>[Link Text](https://url.com)</p>
    <p>`Inline code`</p>
    <p>```<br />Code block<br />```</p>
  </div>
);

const EventRecurrenceEditor: React.FC<{
  recurrence: RecurrenceRule | undefined;
  onChange: (rule: RecurrenceRule | undefined) => void;
  startDate: string; 
}> = ({ recurrence, onChange, startDate }) => {
  const [type, setType] = useState<RecurrenceRule['type'] | ''>(recurrence?.type || ''); 
  const [interval, setIntervalValue] = useState(recurrence?.interval || 1);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(recurrence?.daysOfWeek || []);
  const [endDate, setEndDate] = useState(recurrence?.endDate || '');

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    if (type && interval > 0) { 
      const newRule: RecurrenceRule = { type, interval };
      if (type === 'weekly' && daysOfWeek.length > 0) {
        newRule.daysOfWeek = [...daysOfWeek].sort((a,b) => a-b); 
      } else if (type === 'weekly' && startDate && daysOfWeek.length === 0 && isValidDate(parseISO(startDate))) { 
         const startDay = parseISO(startDate + 'T00:00:00Z').getDay(); 
         newRule.daysOfWeek = [startDay];
      }
      if (endDate && isValidDate(parseISO(endDate))) newRule.endDate = endDate; else if (newRule.endDate) delete newRule.endDate; 
      onChange(newRule);
    } else {
      onChange(undefined); 
    }
  }, [type, interval, daysOfWeek, endDate, onChange, startDate]);

  const toggleDay = (dayIndex: number) => {
    setDaysOfWeek(prev => prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex]);
  };
  
  if (type === '') { 
    return <Button variant="outline" size="sm" onClick={() => setType('weekly')} className="w-full input-field text-xs justify-start font-normal"><Repeat className="w-3 h-3 mr-1.5"/>Set Recurrence</Button>
  }

  return (
    <div className="space-y-2 p-3 border border-border-main rounded-md bg-input-bg/50 mt-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">Recurrence</p>
        <Button variant="ghost" size="icon" className="w-5 h-5" onClick={() => { onChange(undefined); setType(''); }}><X className="w-3 h-3"/></Button>
      </div>
      <Select 
        value={type} 
        onValueChange={(selectedValue: string) => {
            if (["daily", "weekly", "monthly", "yearly"].includes(selectedValue)) {
                setType(selectedValue as RecurrenceRule['type']);
            }
        }}
      >
        <SelectTrigger className="input-field text-xs h-8"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly (on start date's day)</SelectItem>
          <SelectItem value="yearly">Yearly (on start date)</SelectItem>
        </SelectContent>
      </Select>
      <Input type="number" min="1" value={interval} onChange={e => setIntervalValue(Math.max(1, parseInt(e.target.value)))} placeholder="Interval" className="input-field text-xs h-8" />
      {type === 'weekly' && (
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
          {weekDays.map((day, i) => (
            <Button key={i} variant={daysOfWeek.includes(i) ? 'default': 'outline'} size="sm" onClick={() => toggleDay(i)} className={cn("text-[10px] flex-1 h-7 px-1", daysOfWeek.includes(i) ? 'bg-primary text-primary-foreground' : 'border-border-main')}>
              {day}
            </Button>
          ))}
        </div>
      )}
      <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} placeholder="End Date (optional)" title="Recurrence End Date" className="input-field text-xs h-8" />
    </div>
  );
};

interface CalendarFullScreenViewProps {
  events: AppEvent[];
  categories: Category[]; 
  currentCategory: Category; 
  onAddEvent: (eventData: Omit<AppEvent, 'id' | 'userId'>) => void;
  onUpdateEvent: (eventId: string, eventUpdateData: Partial<Omit<AppEvent, 'id' | 'userId'>>) => void;
  onDeleteEvent: (eventId: string) => void;
  onClose: () => void;
}

interface EventFormData {
  title: string;
  date: string; 
  time: string; 
  category: Category; 
  description?: string;
  recurrenceRule?: RecurrenceRule;
}

export function CalendarFullScreenView({
  events, categories, currentCategory, onAddEvent, onUpdateEvent, onDeleteEvent, onClose
}: CalendarFullScreenViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMonth, setViewMonth] = useState<Date>(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null);
  const [isPreviewingDescription, setIsPreviewingDescription] = useState(false);
  
  // Use useMemo to derive the default category for the form.
  // This value will only recompute if `currentCategory` or `categories` (props) change.
  const resolvedInitialCategoryForForm = useMemo(() => {
    if (currentCategory !== "All Projects" && categories.includes(currentCategory)) {
        return currentCategory;
    }
    const firstSpecificCategory = categories.find(c => c !== "All Projects" && c !== undefined);
    if (firstSpecificCategory) {
        return firstSpecificCategory;
    }
    return categories.length > 0 && categories[0] !== "All Projects" ? categories[0] : "Personal Life" as Category;
  }, [currentCategory, categories]);

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: format(selectedDate || new Date(), 'yyyy-MM-dd'),
    time: '12:00',
    category: resolvedInitialCategoryForForm, // Initialize with the memoized value
    description: '',
    recurrenceRule: undefined,
  });

  useEffect(() => {
    if (!showEventForm && !editingEvent) {
      // `resolvedInitialCategoryForForm` is used here. It's stable unless its own deps change.
      const newDefaultCategory = resolvedInitialCategoryForForm;
      const newDefaultDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');

      setFormData(prev => {
        if (prev.category !== newDefaultCategory || prev.date !== newDefaultDate) {
          // Only update if there's an actual change.
          return { 
            ...prev, 
            category: newDefaultCategory, 
            date: newDefaultDate 
          };
        }
        return prev; // No change needed, return previous state reference to prevent re-render.
      });
    }
  }, [selectedDate, resolvedInitialCategoryForForm, showEventForm, editingEvent]);


  const handleShowNewEventForm = () => {
    setEditingEvent(null);
    setIsPreviewingDescription(false);
    setFormData({
      title: '',
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      time: '12:00',
      category: resolvedInitialCategoryForForm, // Use memoized value
      description: '',
      recurrenceRule: undefined,
    });
    setShowEventForm(true);
  };

  useEffect(() => {
    if (editingEvent) {
      const eventDateObj = parseISO(editingEvent.date);
      setFormData({
        title: editingEvent.title,
        date: format(eventDateObj, 'yyyy-MM-dd'),
        time: format(eventDateObj, 'HH:mm'),
        category: editingEvent.category, 
        description: editingEvent.description || '',
        recurrenceRule: editingEvent.recurrenceRule,
      });
      setShowEventForm(true);
      setIsPreviewingDescription(false);
    }
  }, [editingEvent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (value: string) => {
    const foundCategory = categories.find(cat => cat === value);
    if (foundCategory) {
        setFormData(prev => ({ ...prev, category: foundCategory }));
    } else {
        console.error(`Invalid category value received from Select: ${value}.`);
    }
  };

  const handleRecurrenceChange = (rule: RecurrenceRule | undefined) => {
    setFormData(prev => ({ ...prev, recurrenceRule: rule}));
  }

  const resetForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
    setIsPreviewingDescription(false);
    setFormData({ 
      title: '',
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      time: '12:00',
      category: resolvedInitialCategoryForForm, // Use memoized value
      description: '',
      recurrenceRule: undefined,
    });
  };

  const handleSubmitEvent = () => {
    if (!formData.title || !formData.date || !formData.time) return;
    const dateTimeString = `${formData.date}T${formData.time}:00.000Z`; 
    
    const eventDataSubmit = {
        title: formData.title,
        date: dateTimeString,
        category: formData.category, 
        description: formData.description,
        recurrenceRule: formData.recurrenceRule,
    };

    if (editingEvent) {
      onUpdateEvent(editingEvent.id, eventDataSubmit);
    } else {
      onAddEvent(eventDataSubmit);
    }
    resetForm();
  };
  
  const getNextOccurrence = (event: AppEvent, fromDate: Date): Date | null => {
    if (!event.recurrenceRule) return null;
    const rule = event.recurrenceRule;
    let baseDate = startOfDay(parseISO(event.date)); 
    let checkDate = startOfDay(fromDate); 

    if (rule.endDate && checkDate > startOfDay(parseISO(rule.endDate))) return null;

    for(let i=0; i< 365; i++) { 
        let currentIterDate: Date;
        switch(rule.type) {
            case 'daily': 
                currentIterDate = add(baseDate, { days: rule.interval * i });
                break;
            case 'weekly':
                currentIterDate = add(baseDate, { weeks: rule.interval * i });
                if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
                    let baseDayOfWeek = currentIterDate.getDay();
                    let targetDayInWeek = rule.daysOfWeek.find(d => d >= baseDayOfWeek);
                    if (targetDayInWeek !== undefined) {
                        currentIterDate = add(currentIterDate, { days: targetDayInWeek - baseDayOfWeek });
                    } else {
                        currentIterDate = add(baseDate, { weeks: rule.interval * (i + 1) }); 
                        currentIterDate = add(currentIterDate, { days: rule.daysOfWeek[0] - currentIterDate.getDay() }); 
                    }
                }
                break;
            case 'monthly': 
                currentIterDate = add(baseDate, { months: rule.interval * i}); 
                if (currentIterDate.getDate() !== baseDate.getDate()) { 
                    const lastDayOfMonth = new Date(currentIterDate.getFullYear(), currentIterDate.getMonth() + 1, 0).getDate();
                    if (baseDate.getDate() > lastDayOfMonth) {
                        currentIterDate.setDate(lastDayOfMonth);
                    } else {
                         currentIterDate.setDate(baseDate.getDate());
                    }
                }
                break;
            case 'yearly': 
                currentIterDate = add(baseDate, { years: rule.interval * i}); 
                if (currentIterDate.getMonth() !== baseDate.getMonth() || currentIterDate.getDate() !== baseDate.getDate()) {
                    currentIterDate = new Date(currentIterDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
                }
                break;
            default: return null;
        }
        currentIterDate = startOfDay(currentIterDate);

        if(currentIterDate >= checkDate) { 
             if (rule.endDate && currentIterDate > startOfDay(parseISO(rule.endDate))) return null; 
            return currentIterDate;
        }
    }
    return null;
  };

  const DayCellContent: DateFormatter = useCallback((day, options) => { 
    const dayStart = startOfDay(day);
    let hasBaseEvent = false;
    let hasRecurringInstance = false;

    events.forEach(event => {
        if (!event) return;
        const eventBaseDate = startOfDay(parseISO(event.date));
        if (eventBaseDate.getTime() === dayStart.getTime()) {
            hasBaseEvent = true;
        }
        if (event.recurrenceRule) {
            const next = getNextOccurrence(event, add(dayStart, {days: -1})); 
            if (next && startOfDay(next).getTime() === dayStart.getTime()) {
                hasRecurringInstance = true;
            }
        }
    });

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {format(day, "d", { locale: options?.locale })} 
        {(hasBaseEvent || hasRecurringInstance) && (
          <span className={cn(
              "absolute bottom-1.5 left-1/2 -translate-x-1/2 size-1.5 rounded-full",
              hasBaseEvent && hasRecurringInstance ? "bg-gradient-to-r from-primary to-destructive" :
              hasBaseEvent ? "bg-primary" : 
              "bg-primary/50" 
          )} />
        )}
      </div>
    );
  }, [events]); 
  
  const eventsForSelectedDay = selectedDate ? events.flatMap(event => {
    if (!event) return [];
    const eventDateObj = parseISO(event.date);
    const selectedDayStart = startOfDay(selectedDate);
    const eventDayStart = startOfDay(eventDateObj);
    
    const results: AppEvent[] = [];
    if (eventDayStart.getTime() === selectedDayStart.getTime()) {
        results.push(event); 
    }
    
    if (event.recurrenceRule) {
        const next = getNextOccurrence(event, add(selectedDayStart, {days: -1})); 
        if (next && startOfDay(next).getTime() === selectedDayStart.getTime()) {
            if (eventDayStart.getTime() !== selectedDayStart.getTime()) { 
                results.push({
                    ...event,
                    date: format(selectedDate, 'yyyy-MM-dd') + 'T' + format(eventDateObj, 'HH:mm:ss.SSS') + 'Z', 
                });
            }
        }
    }
    return results;

  }).filter((event, index, self) => index === self.findIndex((e) => e.id === event.id && e.date === event.date)) 
  .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()) : [];


  return (
    <div className={cn(
        "fixed inset-0 z-[85] bg-background p-6 flex flex-col",
        "pt-[calc(5rem+2.75rem+1.5rem)]" 
    )}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="font-orbitron text-3xl accent-text">Calendar</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:accent-text p-2 rounded-md hover:bg-input-bg">
                <X className="w-7 h-7" />
            </Button>
        </div>

        <div className="flex-grow flex gap-6 overflow-hidden">
            <div className="w-2/3 lg:w-3/4 bg-widget-background border border-border-main rounded-md p-6 flex flex-col items-center justify-start custom-scrollbar-fullscreen">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    month={viewMonth}
                    onMonthChange={setViewMonth}
                    className="w-full max-w-2xl" 
                    classNames={{
                        root: "w-full", 
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center h-10 mb-2",
                        caption_label: "text-xl font-orbitron accent-text",
                        nav: "space-x-1 flex items-center",
                        nav_button: cn(
                            "h-8 w-8 bg-transparent p-0 opacity-80 hover:opacity-100",
                            "rounded-md hover:bg-accent/20 text-muted-foreground hover:text-accent-foreground transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        ),
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex w-full mb-1",
                        head_cell: "text-muted-foreground rounded-md w-[14.28%] text-xs font-medium p-1 h-8 justify-center",
                        row: "flex w-full mt-2",
                        cell: "text-center text-sm p-0 relative w-[14.28%] h-16 sm:h-20 focus-within:relative focus-within:z-20",
                        day: cn(
                            "w-full h-full p-0 font-normal rounded-md",
                            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            "transition-colors"
                        ),
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary focus:text-primary-foreground",
                        day_today: "bg-accent text-accent-foreground ring-1 ring-primary/60",
                        day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                        day_disabled: "text-muted-foreground opacity-50 pointer-events-none",
                    }}
                    components={{
                        IconLeft: ({ ...props }) => <ChevronLeft {...props} className="h-5 w-5" />,
                        IconRight: ({ ...props }) => <ChevronRight {...props} className="h-5 w-5" />,
                    }}
                    formatters={{ formatDay: DayCellContent }}
                    showOutsideDays
                    fixedWeeks
                />
            </div>

            <div className="w-1/3 lg:w-1/4 bg-widget-background border border-border-main rounded-md p-4 flex flex-col space-y-4 overflow-y-auto custom-scrollbar-fullscreen">
                <Button onClick={handleShowNewEventForm} className="w-full btn-primary">
                    <PlusCircle className="w-4 h-4 mr-2"/> Add Event
                </Button>

                {showEventForm && (
                    <div className="p-3 border border-border-main rounded-md bg-input-bg/70 space-y-3">
                        <h3 className="font-orbitron text-lg accent-text">{editingEvent ? 'Edit Event' : 'New Event'}</h3>
                        <Input name="title" placeholder="Event Title" value={formData.title} onChange={handleInputChange} className="input-field" disabled={isPreviewingDescription}/>
                        <div className="flex gap-2">
                            <Input name="date" type="date" value={formData.date} onChange={handleInputChange} className="input-field" disabled={isPreviewingDescription}/>
                            <Input name="time" type="time" value={formData.time} onChange={handleInputChange} className="input-field" disabled={isPreviewingDescription}/>
                        </div>
                        <Select name="category" value={formData.category} onValueChange={handleCategoryChange} disabled={isPreviewingDescription}>
                            <SelectTrigger className="input-field"><SelectValue placeholder="Category" /></SelectTrigger>
                            <SelectContent className="bg-widget-background border-border-main">
                                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="event-description" className="text-xs text-muted-foreground">Description (Markdown)</label>
                                <div>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-6 px-1">Help</Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0 w-auto"><MarkdownCheatsheet/></PopoverContent>
                                    </Popover>
                                    <Button variant="ghost" size="icon" onClick={() => setIsPreviewingDescription(!isPreviewingDescription)} className="w-6 h-6 ml-1">
                                        {isPreviewingDescription ? <Pencil className="w-3 h-3"/> : <Eye className="w-3 h-3"/>}
                                    </Button>
                                </div>
                            </div>
                            {isPreviewingDescription ? (
                                <div className="prose prose-sm dark:prose-invert max-w-none p-2 min-h-[60px] border border-dashed border-border-main rounded-md bg-background/50">
                                    <ReactMarkdown>{formData.description || "Nothing to preview..."}</ReactMarkdown>
                                </div>
                            ) : (
                                <Textarea id="event-description" name="description" placeholder="Details... (Markdown supported)" value={formData.description || ''} onChange={handleInputChange} className="input-field min-h-[60px]"/>
                            )}
                        </div>
                        {!isPreviewingDescription && <EventRecurrenceEditor recurrence={formData.recurrenceRule} onChange={handleRecurrenceChange} startDate={formData.date}/>}
                        <div className="flex gap-2 pt-2">
                            <Button onClick={handleSubmitEvent} className="flex-grow btn-primary" disabled={isPreviewingDescription}>{editingEvent ? 'Save Changes' : 'Add Event'}</Button>
                            <Button variant="outline" onClick={resetForm} className="border-border-main text-muted-foreground hover:bg-background">Cancel</Button>
                        </div>
                    </div>
                )}

                {!showEventForm && selectedDate && (
                    <div>
                        <h3 className="font-orbitron text-lg accent-text mb-2">
                            Events for: {format(selectedDate, 'MMM d, yyyy')}
                        </h3>
                        {eventsForSelectedDay.length > 0 ? (
                            <ul className="space-y-2">
                                {eventsForSelectedDay.map((event, idx) => ( 
                                    <li key={`${event.id}-${idx}`} className="p-2.5 bg-input-bg/70 border border-border-main rounded-md">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-sm text-foreground">{event.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {format(parseISO(event.date), 'p')} - {event.category}
                                                    {event.recurrenceRule && <Repeat className="w-3 h-3 inline ml-1.5 text-muted-foreground/70"/>}
                                                </p>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <Button variant="ghost" size="icon" onClick={() => { setEditingEvent(events.find(e=>e.id === event.id) || event) }} className="btn-icon w-6 h-6"><Edit className="w-3.5 h-3.5"/></Button>
                                                <Button variant="ghost" size="icon" onClick={() => onDeleteEvent(event.id)} className="btn-icon danger w-6 h-6"><Trash2 className="w-3.5 h-3.5"/></Button>
                                            </div>
                                        </div>
                                        {event.description && (
                                            <div className="prose prose-sm dark:prose-invert max-w-none mt-1 pt-1 border-t border-border-main/50 text-foreground">
                                               <ReactMarkdown>{event.description}</ReactMarkdown>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">No events for this day.</p>
                        )}
                    </div>
                )}
                 {!showEventForm && !selectedDate && (
                    <p className="text-sm text-muted-foreground text-center py-4">Select a date to see events.</p>
                )}
            </div>
        </div>
    </div>
  );
}
```

## src/components/views/GoalsView.tsx

```typescript
"use client";

import React, { useState } from 'react';
import { Goal, Category } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Edit, Trash2, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalsViewProps {
  goals: Goal[];
  categories: Category[];
  currentCategory: Category;
  onAddGoal: (name: string, targetValue: number, unit: string, category: Category) => void;
  onUpdateGoal: (goalId: string, currentValue: number, name?: string, targetValue?: number, unit?: string) => void;
  onDeleteGoal: (goalId: string) => void;
  onClose: () => void;
}

export function GoalsView({ goals, categories, currentCategory, onAddGoal, onUpdateGoal, onDeleteGoal, onClose }: GoalsViewProps) {
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalUnit, setNewGoalUnit] = useState('km'); // Default or common unit
  const [newGoalCategory, setNewGoalCategory] = useState<Category>(currentCategory);

  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editGoalName, setEditGoalName] = useState('');
  const [editGoalCurrent, setEditGoalCurrent] = useState('');
  const [editGoalTarget, setEditGoalTarget] = useState('');
  const [editGoalUnit, setEditGoalUnit] = useState('');

  const handleAddGoal = () => {
    if (newGoalName.trim() && parseFloat(newGoalTarget) > 0) {
      onAddGoal(newGoalName.trim(), parseFloat(newGoalTarget), newGoalUnit, newGoalCategory);
      setNewGoalName('');
      setNewGoalTarget('');
      setNewGoalUnit('km'); // Reset to default
    }
  };

  const startEdit = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setEditGoalName(goal.name);
    setEditGoalCurrent(goal.currentValue.toString());
    setEditGoalTarget(goal.targetValue.toString());
    setEditGoalUnit(goal.unit);
  };

  const handleUpdateGoal = () => {
    if (editingGoalId) {
      onUpdateGoal(
        editingGoalId,
        parseFloat(editGoalCurrent), // Current value is required for update
        editGoalName.trim() || undefined,
        parseFloat(editGoalTarget) > 0 ? parseFloat(editGoalTarget) : undefined,
        editGoalUnit.trim() || undefined
      );
      setEditingGoalId(null);
    }
  };

  const filteredGoals = goals.filter(goal => currentCategory === "All Projects" || goal.category === currentCategory);

  return (
    <div className={cn(
        "fixed inset-0 z-[85] bg-[var(--background-color-val)] p-6 flex flex-col",
        "pt-[calc(5rem+2.75rem+1.5rem)]" // Consistent top padding
    )}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-orbitron text-3xl accent-text">Goals</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-[var(--text-muted-color-val)] hover:accent-text p-2 rounded-md hover:bg-[var(--input-bg-val)]">
          <X className="w-7 h-7" />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto bg-[var(--widget-background-val)] border border-[var(--border-color-val)] rounded-md p-6 custom-scrollbar-fullscreen space-y-6">
        {/* Add Goal Form */}
        <div className="space-y-3 p-4 bg-[var(--input-bg-val)] border border-[var(--border-color-val)] rounded-md">
          <Input
            placeholder="Goal name (e.g., Read 10 books)"
            value={newGoalName}
            onChange={(e) => setNewGoalName(e.target.value)}
            className="input-field text-base p-3"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              type="number"
              placeholder="Target (e.g., 10)"
              value={newGoalTarget}
              onChange={(e) => setNewGoalTarget(e.target.value)}
              className="input-field text-sm p-3"
            />
            <Input
              placeholder="Unit (e.g., books, km, %)"
              value={newGoalUnit}
              onChange={(e) => setNewGoalUnit(e.target.value)}
              className="input-field text-sm p-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
            <div className="sm:col-span-2">
                <label htmlFor="goal-category-select" className="sr-only">Category</label>
                <Select value={newGoalCategory} onValueChange={(val) => setNewGoalCategory(val as Category)}>
                    <SelectTrigger id="goal-category-select" className="input-field text-sm h-auto py-2.5">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--widget-background-val)] border-[var(--border-color-val)] text-[var(--text-color-val)]">
                        {categories.map(cat => <SelectItem key={cat} value={cat} className="hover:!bg-[rgba(0,220,255,0.1)] focus:!bg-[rgba(0,220,255,0.1)]">{cat}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleAddGoal} className="btn-primary sm:col-span-3 text-sm h-auto py-2.5">
                <PlusCircle className="w-4 h-4 mr-2"/> Add New Goal
            </Button>
          </div>
        </div>

        {/* Goals List */}
        <ul className="space-y-3">
          {filteredGoals.map(goal => (
            <li key={goal.id} className="bg-[var(--input-bg-val)] border border-[var(--border-color-val)] rounded-md p-3 hover:border-[var(--accent-color-val)]/30 transition-colors">
              {editingGoalId === goal.id ? (
                <div className="space-y-2">
                  <Input value={editGoalName} onChange={e => setEditGoalName(e.target.value)} placeholder="Goal Name" className="input-field p-2 text-sm"/>
                  <div className="grid grid-cols-3 gap-2">
                      <Input type="number" value={editGoalCurrent} onChange={e => setEditGoalCurrent(e.target.value)} placeholder="Current" className="input-field p-2 text-xs"/>
                      <Input type="number" value={editGoalTarget} onChange={e => setEditGoalTarget(e.target.value)} placeholder="Target" className="input-field p-2 text-xs"/>
                      <Input value={editGoalUnit} onChange={e => setEditGoalUnit(e.target.value)} placeholder="Unit" className="input-field p-2 text-xs"/>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button onClick={handleUpdateGoal} size="sm" className="btn-primary text-xs px-3 py-1.5">Save</Button>
                    <Button onClick={() => setEditingGoalId(null)} variant="outline" size="sm" className="border-[var(--border-color-val)] text-[var(--text-muted-color-val)] hover:bg-[var(--background-color-val)] text-xs px-3 py-1.5">Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-semibold text-[var(--text-color-val)]">{goal.name}</h3>
                      <p className="text-xs text-[var(--text-muted-color-val)]">
                        {goal.category} • Target: {goal.targetValue} {goal.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(goal)} className="btn-icon w-7 h-7 text-[var(--text-muted-color-val)] hover:accent-text">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteGoal(goal.id)} className="btn-icon danger w-7 h-7 text-[var(--text-muted-color-val)] hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-[var(--text-muted-color-val)] mb-0.5">
                        <span>{goal.currentValue} {goal.unit}</span>
                        <span className="accent-text font-medium">
                            {Math.round((goal.currentValue / goal.targetValue) * 100)}%
                        </span>
                    </div>
                    <Progress 
                        value={(goal.currentValue / goal.targetValue) * 100} 
                        className="h-2 bg-[var(--background-color-val)]/70" 
                        indicatorClassName="bg-[var(--accent-color-val)]" 
                    />
                  </div>
                </>
              )}
            </li>
          ))}
          {filteredGoals.length === 0 && (
            <p className="text-center text-[var(--text-muted-color-val)] py-10">No goals in this category yet. Set some aspirations!</p>
          )}
        </ul>
      </div>
    </div>
  );
}

```

## src/components/views/NotesView.tsx

```typescript
"use client";

import React, { useState, useEffect } from 'react';
import { Note, Category } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Edit, Trash2, PlusCircle, Eye, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // For markdown cheatsheet

const MarkdownCheatsheet: React.FC = () => (
  <div className="p-3 text-xs space-y-1 text-muted-foreground bg-popover border border-border rounded-md shadow-md w-64">
    <p><strong># H1</strong>, <strong>## H2</strong>, <strong>### H3</strong></p>
    <p><strong>**bold**</strong> or __bold__</p>
    <p><em>*italic*</em> or _italic_</p>
    <p>~<sub>~</sub>Strikethrough~<sub>~</sub></p>
    <p>Unordered List: <br />- Item 1<br />- Item 2</p>
    <p>Ordered List: <br />1. Item 1<br />2. Item 2</p>
    <p>Checklist: <br />- [ ] To do<br />- [x] Done</p>
    <p>[Link Text](https://url.com)</p>
    <p>`Inline code`</p>
    <p>```<br />Code block<br />```</p>
  </div>
);


export function NotesView({ notes, categories, currentCategory, onAddNote, onUpdateNote, onDeleteNote, onClose }: NotesViewProps) {
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<Category>(currentCategory);
  const [isNewNotePreview, setIsNewNotePreview] = useState(false);

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteTitle, setEditNoteTitle] = useState('');
  const [editNoteContent, setEditNoteContent] = useState('');
  const [isEditNotePreview, setIsEditNotePreview] = useState(false);

  useEffect(() => {
    if (currentCategory === "All Projects" && categories.length > 0) {
        setNewNoteCategory(categories[0]);
    } else if (categories.includes(currentCategory)) {
        setNewNoteCategory(currentCategory);
    } else if (categories.length > 0) {
        setNewNoteCategory(categories[0]);
    }
  }, [currentCategory, categories]);

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      onAddNote(newNoteTitle.trim() || undefined, newNoteContent.trim(), newNoteCategory);
      setNewNoteTitle('');
      setNewNoteContent('');
      setIsNewNotePreview(false);
      if (currentCategory === "All Projects" && categories.length > 0) setNewNoteCategory(categories[0]);
        else if (categories.includes(currentCategory)) setNewNoteCategory(currentCategory);
        else if (categories.length > 0) setNewNoteCategory(categories[0]);
    }
  };

  const startEdit = (note: Note) => {
    setEditingNoteId(note.id);
    setEditNoteTitle(note.title || '');
    setEditNoteContent(note.content);
    setIsEditNotePreview(false);
  };

  const handleUpdateNote = () => {
    if (editingNoteId && editNoteContent.trim()) {
      onUpdateNote(editingNoteId, editNoteTitle.trim() || undefined, editNoteContent.trim());
      setEditingNoteId(null);
      setIsEditNotePreview(false);
    }
  };
  
  const filteredNotes = notes
    .filter(note => currentCategory === "All Projects" || note.category === currentCategory)
    .sort((a,b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());

  return (
    <div className={cn(
        "fixed inset-0 z-[85] bg-background p-6 flex flex-col",
        "pt-[calc(5rem+2.75rem+1.5rem)]" 
    )}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-orbitron text-3xl accent-text">Notes</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:accent-text p-2 rounded-md hover:bg-input-bg">
          <X className="w-7 h-7" />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto bg-widget-background border border-border-main rounded-md p-6 custom-scrollbar-fullscreen space-y-6">
        {/* Add Note Form */}
        <div className="space-y-3 p-4 bg-input-bg border border-border-main rounded-md">
            <div className="flex justify-between items-center">
                <Input
                    placeholder="Note title (optional)"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className="input-field text-base p-3 flex-grow"
                    disabled={isNewNotePreview}
                />
                <div className="flex items-center ml-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">Markdown?</Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto"><MarkdownCheatsheet/></PopoverContent>
                    </Popover>
                    <Button variant="ghost" size="icon" onClick={() => setIsNewNotePreview(!isNewNotePreview)} className="w-8 h-8 ml-1">
                        {isNewNotePreview ? <Pencil className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    </Button>
                </div>
            </div>
            {isNewNotePreview ? (
                <div className="prose prose-sm dark:prose-invert max-w-none p-3 min-h-[100px] border border-dashed border-border-main rounded-md">
                    <ReactMarkdown>{newNoteContent || "Nothing to preview..."}</ReactMarkdown>
                </div>
            ) : (
                <Textarea
                    placeholder="Type your note content here (Markdown supported)..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    className="input-field min-h-[100px] text-base p-3"
                />
            )}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
            <div className="sm:col-span-2">
                <label htmlFor="note-category-select" className="sr-only">Category</label>
                <Select value={newNoteCategory} onValueChange={(val) => setNewNoteCategory(val as Category)} disabled={isNewNotePreview}>
                    <SelectTrigger id="note-category-select" className="input-field text-sm h-auto py-2.5">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-widget-background border-border-main text-text-main">
                        {categories.map(cat => <SelectItem key={cat} value={cat} className="hover:!bg-[rgba(0,220,255,0.1)] focus:!bg-[rgba(0,220,255,0.1)]">{cat}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleAddNote} className="btn-primary sm:col-span-3 text-sm h-auto py-2.5" disabled={isNewNotePreview}>
                 <PlusCircle className="w-4 h-4 mr-2"/> Add New Note
            </Button>
          </div>
        </div>

        {/* Notes List */}
        <ul className="space-y-3">
          {filteredNotes.map(note => (
            <li key={note.id} className="bg-input-bg border border-border-main rounded-md p-3 hover:border-accent/30 transition-colors">
              {editingNoteId === note.id ? (
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Input value={editNoteTitle} onChange={e => setEditNoteTitle(e.target.value)} placeholder="Title (optional)" className="input-field p-2 text-sm flex-grow" disabled={isEditNotePreview}/>
                        <div className="flex items-center ml-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">Markdown?</Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-auto"><MarkdownCheatsheet/></PopoverContent>
                            </Popover>
                            <Button variant="ghost" size="icon" onClick={() => setIsEditNotePreview(!isEditNotePreview)} className="w-8 h-8 ml-1">
                                {isEditNotePreview ? <Pencil className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                            </Button>
                        </div>
                    </div>
                    {isEditNotePreview ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none p-2 min-h-[80px] border border-dashed border-border-main rounded-md">
                           <ReactMarkdown>{editNoteContent || "Nothing to preview..."}</ReactMarkdown>
                        </div>
                    ) : (
                        <Textarea value={editNoteContent} onChange={e => setEditNoteContent(e.target.value)} placeholder="Content" className="input-field min-h-[80px] p-2 text-sm"/>
                    )}
                    <div className="flex gap-2 pt-1">
                        <Button onClick={handleUpdateNote} size="sm" className="btn-primary text-xs px-3 py-1.5" disabled={isEditNotePreview}>Save Changes</Button>
                        <Button onClick={() => setEditingNoteId(null)} variant="outline" size="sm" className="border-border-main text-muted-foreground hover:bg-background text-xs px-3 py-1.5">Cancel</Button>
                    </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-1">
                      <div>
                          {note.title && <h4 className="text-base font-semibold text-text-main">{note.title}</h4>}
                          <p className="text-xs text-muted-foreground">
                              {note.category} • Edited: {new Date(note.lastEdited).toLocaleDateString()}
                          </p>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                          <Button variant="ghost" size="icon" onClick={() => startEdit(note)} className="btn-icon w-7 h-7 text-muted-foreground hover:accent-text">
                              <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => onDeleteNote(note.id)} className="btn-icon danger w-7 h-7 text-muted-foreground hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                          </Button>
                      </div>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-text-main leading-relaxed note-content-markdown">
                    <ReactMarkdown>{note.content}</ReactMarkdown>
                  </div>
                </>
              )}
            </li>
          ))}
          {filteredNotes.length === 0 && (
            <p className="text-center text-muted-foreground py-10">No notes in this category. Jot something down!</p>
          )}
        </ul>
      </div>
    </div>
  );
}

```

## src/components/views/TasksView.tsx

```typescript
"use client";

import React, { useState, useEffect } from 'react';
import { Task, Category, RecurrenceRule, SubTask } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"; 
import { X, Edit, Trash2, CalendarDays, PlusCircle, Repeat, GripVertical, ListPlus, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'; 
import { format, parseISO, isValid as isValidDateFn } from 'date-fns';

interface TasksViewProps {
  tasks: Task[];
  categories: Category[];
  currentCategory: Category;
  onAddTask: (taskData: Omit<Task, 'id' | 'completed'>) => void;
  onToggleTask: (taskId: string, subTaskId?: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, taskUpdateData: Partial<Omit<Task, 'id'>>) => void;
  onClose: () => void;
}

// Simplified Recurrence Editor Component (can be expanded)
const RecurrenceEditor: React.FC<{
  recurrence: RecurrenceRule | undefined;
  onChange: (rule: RecurrenceRule | undefined) => void;
}> = ({ recurrence, onChange }) => {
  const [type, setType] = useState(recurrence?.type || '');
  const [interval, setIntervalValue] = useState(recurrence?.interval || 1);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(recurrence?.daysOfWeek || []);
  const [endDate, setEndDate] = useState(recurrence?.endDate || '');

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    if (type && interval > 0) {
      const newRule: RecurrenceRule = { type, interval };
      if (type === 'weekly' && daysOfWeek.length > 0) newRule.daysOfWeek = daysOfWeek;
      if (endDate) newRule.endDate = endDate;
      onChange(newRule);
    } else if (type === '') { // User explicitly cleared the type (or wants to disable recurrence)
      onChange(undefined); 
    }
  }, [type, interval, daysOfWeek, endDate, onChange]);

  const toggleDay = (dayIndex: number) => {
    setDaysOfWeek(prev => prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex].sort());
  };
  
  const handleTypeChange = (val: string) => {
    if (val === '') { // "Disable Recurrence" option
      setType('');
      onChange(undefined);
    } else {
      setType(val as RecurrenceRule['type']);
    }
  };


  if (!recurrence && type === '') { // Initial state to enable recurrence
    return <Button variant="outline" onClick={() => setType('weekly')} className="input-field text-sm justify-start font-normal h-auto py-2.5"><Repeat className="w-3.5 h-3.5 mr-2 text-muted-foreground"/>Set Recurrence</Button>
  }

  return (
    <div className="space-y-3 p-3 border border-border-main rounded-md bg-input-bg/50">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">Recurrence</p>
        <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => { onChange(undefined); setType(''); }}><X className="w-3.5 h-3.5"/></Button>
      </div>
      <Select value={type} onValueChange={handleTypeChange}>
        <SelectTrigger className="input-field text-xs h-8"><SelectValue placeholder="Select type..."/></SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly (on start date's day)</SelectItem>
          <SelectItem value="yearly">Yearly (on start date)</SelectItem>
          <SelectItem value="">Disable Recurrence</SelectItem>
        </SelectContent>
      </Select>
      {type && <>
        <Input type="number" value={interval} onChange={e => setIntervalValue(Math.max(1, parseInt(e.target.value)))} placeholder="Interval (e.g., 1 for every, 2 for every other)" title="Repeat every X (days/weeks/months/years)" className="input-field text-xs h-8" />
        {type === 'weekly' && (
            <div className="grid grid-cols-4 gap-1 sm:grid-cols-7">
            {weekDays.map((day, i) => (
                <Button key={i} variant={daysOfWeek.includes(i) ? 'default': 'outline'} size="sm" onClick={() => toggleDay(i)} className={cn("text-[10px] flex-1 h-7 px-1", daysOfWeek.includes(i) ? 'bg-primary text-primary-foreground' : 'border-border-main')}>
                {day}
                </Button>
            ))}
            </div>
        )}
        <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} placeholder="End Date (optional)" title="Recurrence End Date" className="input-field text-xs h-8" />
      </>}
    </div>
  );
};


export function TasksView({ tasks, categories, currentCategory, onAddTask, onToggleTask, onDeleteTask, onUpdateTask, onClose }: TasksViewProps) {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<Category>(currentCategory === "All Projects" && categories.length > 0 ? categories[0] : currentCategory);
  const [newRecurrenceRule, setNewRecurrenceRule] = useState<RecurrenceRule | undefined>(undefined);
  const [newSubTasks, setNewSubTasks] = useState<Omit<SubTask, 'id' | 'completed'>[]>([]);
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => { 
    if (currentCategory === "All Projects" && categories.length > 0) {
        setNewTaskCategory(categories[0]);
    } else if (categories.includes(currentCategory)) {
        setNewTaskCategory(currentCategory);
    } else if (categories.length > 0) {
        setNewTaskCategory(categories[0]);
    }
  }, [currentCategory, categories]);

  const resetNewTaskForm = () => {
    setNewTaskText('');
    setNewTaskDueDate('');
    setNewRecurrenceRule(undefined);
    setNewSubTasks([]);
    if (currentCategory === "All Projects" && categories.length > 0) setNewTaskCategory(categories[0]);
    else if (categories.includes(currentCategory)) setNewTaskCategory(currentCategory);
    else if (categories.length > 0) setNewTaskCategory(categories[0]);
  };

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      const taskData: Omit<Task, 'id' | 'completed'> = {
        text: newTaskText.trim(),
        category: newTaskCategory,
        dueDate: newTaskDueDate || undefined,
        recurrenceRule: newRecurrenceRule,
        subTasks: newSubTasks.filter(st => st.text.trim() !== '').map(st => ({id: uuidv4(), text: st.text, completed: false})),
      };
      onAddTask(taskData);
      resetNewTaskForm();
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditingTask(null);
    setIsEditModalOpen(false);
  };

  const handleSaveEditedTask = (formData: {text: string; dueDate?: string; category: Category; recurrenceRule?: RecurrenceRule; subTasks?: SubTask[]}) => {
    if (editingTask) {
        onUpdateTask(editingTask.id, {
            text: formData.text,
            dueDate: formData.dueDate,
            category: formData.category,
            recurrenceRule: formData.recurrenceRule,
            subTasks: formData.subTasks, // Backend will assign IDs if new
        });
        closeEditModal();
    }
  };

  const handleAddSubTaskToNew = () => setNewSubTasks([...newSubTasks, { text: '' }]);
  const handleNewSubTaskChange = (index: number, text: string) => {
    const updated = [...newSubTasks];
    updated[index].text = text;
    setNewSubTasks(updated);
  };
  const handleRemoveSubTaskFromNew = (index: number) => {
    const updated = [...newSubTasks];
    updated.splice(index, 1);
    setNewSubTasks(updated);
  };

  const filteredTasks = tasks
    .filter(task => (currentCategory === "All Projects" || task.category === currentCategory) && (showCompleted || !task.completed))
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const dateA = a.dueDate && isValidDateFn(parseISO(a.dueDate)) ? parseISO(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate && isValidDateFn(parseISO(b.dueDate)) ? parseISO(b.dueDate).getTime() : Infinity;
      if (dateA !== dateB) return dateA - dateB;
      return (b.createdAt || '').localeCompare(a.createdAt || ''); // Fallback sort by creation time
    });

  return (
    <div className={cn(
        "fixed inset-0 z-[85] bg-background p-6 flex flex-col",
        "pt-[calc(5rem+2.75rem+1.5rem)]"
    )}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-orbitron text-3xl accent-text">Tasks</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:accent-text p-2 rounded-md hover:bg-input-bg">
          <X className="w-7 h-7" />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto bg-widget-background border border-border-main rounded-md p-6 custom-scrollbar-fullscreen space-y-6">
        {/* Add Task Form */}
        <div className="space-y-3 p-4 bg-input-bg border border-border-main rounded-md">
          <Input
            type="text"
            placeholder="Add new task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="input-field text-base p-3"
          />
          {/* Subtasks for New Task */}
          <div className="pl-4 space-y-2">
            {newSubTasks.map((sub, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CircleDot className="w-3 h-3 text-muted-foreground/50 shrink-0"/>
                  <Input 
                    value={sub.text} 
                    onChange={(e) => handleNewSubTaskChange(index, e.target.value)} 
                    placeholder="Sub-task description"
                    className="input-field text-sm p-1.5 h-8 flex-grow"
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveSubTaskFromNew(index)} className="w-7 h-7"><Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive"/></Button>
                </div>
            ))}
            <Button variant="outline" size="sm" onClick={handleAddSubTaskToNew} className="text-xs border-border-main hover:bg-widget-background"><ListPlus className="w-3 h-3 mr-1.5"/>Add sub-task</Button>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 items-end pt-2">
            <Input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="input-field text-sm h-auto py-2.5"
              title="Due Date"
            />
            <RecurrenceEditor recurrence={newRecurrenceRule} onChange={setNewRecurrenceRule} />

            <Select value={newTaskCategory} onValueChange={(val) => setNewTaskCategory(val as Category)}>
              <SelectTrigger className="input-field text-sm h-auto py-2.5">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-widget-background border-border-main text-text-main">
                {categories.map(cat => <SelectItem key={cat} value={cat} className="hover:!bg-[rgba(0,220,255,0.1)] focus:!bg-[rgba(0,220,255,0.1)]">{cat}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
           <Button onClick={handleAddTask} className="btn-primary w-full mt-3 text-sm h-auto py-2.5">
                <PlusCircle className="w-4 h-4 mr-2"/> Add Task
            </Button>
        </div>

        <div className="flex justify-end items-center">
           <label htmlFor="task-show-completed-fs" className="flex items-center text-xs text-muted-foreground cursor-pointer">
             <Checkbox
                id="task-show-completed-fs"
                checked={showCompleted}
                onCheckedChange={(checked) => setShowCompleted(Boolean(checked))}
                className="mr-1.5 h-3.5 w-3.5 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground"
              /> Show Completed
            </label>
        </div>

        <ul className="space-y-2.5">
          {filteredTasks.map(task => (
            <li key={task.id} className={cn(
                "bg-input-bg border border-border-main rounded-md p-3", 
                task.completed && "opacity-60"
            )}>
                <div className="flex justify-between items-start">
                    <div className="flex items-start flex-grow min-w-0">
                        <Checkbox
                          id={`task-fs-${task.id}`}
                          checked={task.completed}
                          onCheckedChange={() => onToggleTask(task.id)}
                          className="form-checkbox h-5 w-5 shrink-0 mt-0.5 mr-3 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground"
                        />
                        <div className="flex-grow">
                            <span className={cn("text-base block", task.completed && "line-through")}>{task.text}</span>
                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center flex-wrap gap-x-2 gap-y-0.5">
                                <span>{task.category}</span>
                                {task.dueDate && isValidDateFn(parseISO(task.dueDate)) && (
                                    <>
                                        <span className="text-muted-foreground/50">•</span>
                                        <span className="flex items-center"><CalendarDays className="w-3 h-3 inline mr-1" />
                                        {format(parseISO(task.dueDate), 'MMM d, yyyy')}</span>
                                    </>
                                )}
                                {task.recurrenceRule && (
                                    <>
                                        <span className="text-muted-foreground/50">•</span>
                                        <span className="flex items-center"><Repeat className="w-3 h-3 inline mr-1" />
                                        {task.recurrenceRule.type}</span>
                                    </>
                                )}
                            </p>
                        </div>
                  </div>
                  <div className="flex items-center space-x-0.5 shrink-0 ml-2">
                     <Button variant="ghost" size="icon" onClick={() => openEditModal(task)} className="btn-icon w-7 h-7"><Edit className="w-4 h-4" /></Button>
                     <Button variant="ghost" size="icon" onClick={() => onDeleteTask(task.id)} className="btn-icon danger w-7 h-7"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                {/* Display Subtasks */}
                {task.subTasks && task.subTasks.length > 0 && (
                    <div className="pl-8 mt-2 space-y-1.5">
                        {task.subTasks.map(sub => (
                            <div key={sub.id} className="flex items-center text-sm">
                                <Checkbox 
                                    id={`subtask-fs-${task.id}-${sub.id}`}
                                    checked={sub.completed}
                                    onCheckedChange={() => onToggleTask(task.id, sub.id)}
                                    className="h-4 w-4 mr-2 border-muted-foreground data-[state=checked]:bg-primary/70 data-[state=checked]:border-primary/70 data-[state=checked]:text-primary-foreground"
                                />
                                <label htmlFor={`subtask-fs-${task.id}-${sub.id}`} className={cn("flex-grow cursor-pointer", sub.completed && "line-through text-muted-foreground")}>{sub.text}</label>
                            </div>
                        ))}
                    </div>
                )}
            </li>
          ))}
           {filteredTasks.length === 0 && (
            <p className="text-center text-muted-foreground py-10">
                {showCompleted ? "No tasks here." : "No active tasks. Way to go!"}
            </p>
          )}
        </ul>
      </div>

      {isEditModalOpen && editingTask && (
        <EditTaskModal 
            task={editingTask} 
            categories={categories}
            onClose={closeEditModal} 
            onSave={handleSaveEditedTask} 
        />
      )}
    </div>
  );
}

interface EditTaskModalProps {
    task: Task;
    categories: Category[];
    onClose: () => void;
    onSave: (formData: {text: string; dueDate?: string; category: Category; recurrenceRule?: RecurrenceRule; subTasks?: SubTask[]}) => void;
}
function EditTaskModal({ task, categories, onClose, onSave }: EditTaskModalProps) {
    const [text, setText] = useState(task.text);
    const [dueDate, setDueDate] = useState(task.dueDate || '');
    const [category, setCategory] = useState(task.category);
    const [recurrenceRule, setRecurrenceRule] = useState<RecurrenceRule | undefined>(task.recurrenceRule);
    const [subTasks, setSubTasks] = useState<SubTask[]>(task.subTasks ? JSON.parse(JSON.stringify(task.subTasks)) : []); // Deep copy

    const handleAddSubTask = () => setSubTasks([...subTasks, { id: uuidv4(), text: '', completed: false }]);
    const handleSubTaskTextChange = (id: string, newText: string) => {
        setSubTasks(subTasks.map(st => st.id === id ? { ...st, text: newText } : st));
    };
    const handleSubTaskToggle = (id: string) => {
        setSubTasks(subTasks.map(st => st.id === id ? { ...st, completed: !st.completed } : st));
    };
    const handleRemoveSubTask = (id: string) => setSubTasks(subTasks.filter(st => st.id !== id));

    const handleSubmit = () => {
        if(text.trim()) {
            onSave({ text: text.trim(), dueDate: dueDate || undefined, category, recurrenceRule, subTasks: subTasks.filter(st=> st.text.trim() !== '') });
        }
    };

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[110]" onClick={onClose}>
            <div className="bg-widget-background border border-border-main rounded-lg p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center pb-3 border-b border-border-main">
                    <h3 className="font-orbitron text-xl accent-text">Edit Task</h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:accent-text"><X className="w-5 h-5"/></Button>
                </div>
                
                <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar-fullscreen">
                    <label className="text-xs font-medium text-muted-foreground">Task Description</label>
                    <Input value={text} onChange={e => setText(e.target.value)} placeholder="Task description" className="input-field p-3"/>
                    
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Sub-tasks</label>
                        {subTasks.map((sub) => (
                        <div key={sub.id} className="flex items-center gap-2">
                            <Checkbox id={`edit-sub-${sub.id}`} checked={sub.completed} onCheckedChange={() => handleSubTaskToggle(sub.id)} className="h-4 w-4 border-muted-foreground"/>
                            <Input value={sub.text} onChange={e => handleSubTaskTextChange(sub.id, e.target.value)} className="input-field flex-grow text-sm p-1 h-8" placeholder="Sub-task description"/>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveSubTask(sub.id)} className="h-7 w-7"><Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive"/></Button>
                        </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={handleAddSubTask} className="text-xs border-border-main hover:bg-input-bg"><ListPlus className="w-3 h-3 mr-1.5"/>Add sub-task</Button>
                    </div>

                    <label className="text-xs font-medium text-muted-foreground">Details</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="input-field p-3 h-auto" title="Due Date"/>
                        <Select value={category} onValueChange={val => setCategory(val as Category)}>
                            <SelectTrigger className="input-field p-3 h-auto"><SelectValue/></SelectTrigger>
                            <SelectContent className="bg-widget-background border-border-main">
                                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <RecurrenceEditor recurrence={recurrenceRule} onChange={setRecurrenceRule}/>
                </div>

                <div className="flex justify-end pt-4 border-t border-border-main space-x-2 shrink-0">
                    <Button variant="outline" onClick={onClose} className="border-border-main text-muted-foreground hover:bg-input-bg">Cancel</Button>
                    <Button onClick={handleSubmit} className="btn-primary">Save Changes</Button>
                </div>
            </div>
        </div>
    );
}


```

## src/components/layout/AyandaLogoIcon.tsx

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface AyandaLogoIconProps {
  className?: string;
}

// This is the SVG from the target HTML reference
export function AyandaLogoIcon({ className }: AyandaLogoIconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth="1.5" 
      stroke="currentColor" 
      className={cn("w-8 h-8 accent-text", className)} // Use accent-text for cyan color
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  );
}

```

## src/components/layout/FooterChat.tsx

```typescript
"use client";

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface FooterChatProps {
  onSendCommand: (command: string) => void;
}

export function FooterChat({ onSendCommand }: FooterChatProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendCommand(message.trim());
      setMessage('');
    }
  };

  return (
    <div 
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-[98]",
        "w-[clamp(300px,60%,700px)]", 
        "bg-[rgba(20,20,20,0.9)] backdrop-blur-md",
        "border border-[var(--border-color-val)] rounded-full",
        "pl-5 pr-2 py-2",
        "shadow-[0_10px_30px_rgba(0,0,0,0.5)]",
        "flex items-center"
      )}
    >
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="AYANDA, what can I help you with?"
        className={cn(
          "flex-grow bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0",
          "text-[var(--text-color-val)] text-[0.925rem] placeholder:text-[var(--text-muted-color-val)]"
        )}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />
      <Button 
        size="icon"
        onClick={handleSend} 
        className={cn(
          "bg-[var(--accent-color-val)] text-[var(--background-color-val)] hover:bg-[#00B8D4]",
          "rounded-full w-10 h-10",
          "flex items-center justify-center shrink-0 ml-2"
        )}
        disabled={!message.trim()}
        aria-label="Submit AI Input"
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
}

```

## src/components/layout/FooterChat.tsx`:**

```
"use client";

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface FooterChatProps {
  onSendCommand: (command: string) => void; // New prop
}

export function FooterChat({ onSendCommand }: FooterChatProps) { // Destructure new prop
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendCommand(message.trim()); // Use the handler
      setMessage('');
    }
  };
  // ... (rest of the component remains the same styling as before) ...
  return (
    <div 
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-[98]",
        "w-[clamp(300px,60%,700px)]", 
        "bg-[rgba(20,20,20,0.9)] backdrop-blur-md",
        "border border-[var(--border-color-val)] rounded-full",
        "pl-5 pr-2 py-2",
        "shadow-[0_10px_30px_rgba(0,0,0,0.5)]",
        "flex items-center"
      )}
    >
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="AYANDA, what can I help you with?"
        className={cn(
          "flex-grow bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0",
          "text-[var(--text-color-val)] text-[0.925rem] placeholder:text-[var(--text-muted-color-val)]"
        )}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />
      <Button 
        size="icon"
        onClick={handleSend} 
        className={cn(
          "bg-[var(--accent-color-val)] text-[var(--background-color-val)] hover:bg-[#00B8D4]",
          "rounded-full w-10 h-10",
          "flex items-center justify-center shrink-0 ml-2"
        )}
        disabled={!message.trim()}
        aria-label="Submit AI Input"
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
}

```

## src/components/layout/Header.tsx

```typescript
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { LogIn, LogOut, PaletteIcon, Search as SearchIcon, X as XIcon, CalendarIcon, ListChecks, Target, StickyNote } from 'lucide-react'; // Added SearchIcon, XIcon
import { AyandaLogoIcon } from './AyandaLogoIcon';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Added Input
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeCustomizer } from './ThemeCustomizer';
import { SearchResultItem } from '@/types'; // Added SearchResultItem
import { usePathname, useRouter } from 'next/navigation'; // For navigation from search

// Helper to get icon based on search result type
const getIconForType = (type: SearchResultItem['type']) => {
  switch (type) {
    case 'task': return <ListChecks className="w-4 h-4 mr-2 text-muted-foreground" />;
    case 'goal': return <Target className="w-4 h-4 mr-2 text-muted-foreground" />;
    case 'note': return <StickyNote className="w-4 h-4 mr-2 text-muted-foreground" />;
    case 'event': return <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />;
    default: return null;
  }
};


export function Header() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchPopoverOpen, setIsSearchPopoverOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPopoverRef = useRef<HTMLDivElement>(null);

  const currentPathname = usePathname();
  const router = useRouter();


  const handleSearch = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsSearchPopoverOpen(false);
      return;
    }
    setIsSearchLoading(true);
    setIsSearchPopoverOpen(true); // Open popover when search starts
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearchLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
        setIsSearchPopoverOpen(false);
      }
    }, 300); // 300ms debounce
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  // Close search popover on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchPopoverRef.current && !searchPopoverRef.current.contains(event.target as Node) &&
        searchInputRef.current && !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSearchPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigateToItem = (item: SearchResultItem) => {
    // This is a simplified navigation. Ideally, you'd trigger the main page to open the correct view and scroll/highlight the item.
    // For now, it might just navigate to a general area if specific deep linking isn't set up in page.tsx for search results.
    // For MVP, redirecting to the view and user finds it by title might be okay.
    // A more advanced solution involves context or event emitters to tell page.tsx to switch view and highlight.
    
    // For now, we'll assume the path takes us close enough or page.tsx handles it.
    if (item.path) {
       router.push(`/#view=${item.type}&id=${item.id}`); // Example, adapt to how page.tsx handles deep links
    }
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchPopoverOpen(false);
  };

  const showSearch = status === "authenticated" && !["/login", "/register", "/landing"].includes(currentPathname);


  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-[95]",
        "flex items-center justify-between",
        "px-6 py-4",
        "bg-background border-b border-border-main", // Theming
      )}
      style={{ height: '5rem' }}
    >
      <Link href={session ? "/" : "/landing"} className="flex items-center space-x-3 cursor-pointer group">
        <AyandaLogoIcon className="group-hover:scale-110 transition-transform duration-200" />
        <h1 className="font-orbitron text-3xl font-bold tracking-wider accent-text group-hover:brightness-110 transition-all duration-200">AYANDA</h1>
      </Link>
      
      <div className="flex items-center gap-3">
        {showSearch && (
          <div className="relative">
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchQuery.trim().length >=2) setIsSearchPopoverOpen(true);}}
                className="pl-9 pr-8 h-9 w-48 md:w-64 input-field rounded-full bg-input-bg border-border-main focus:bg-widget-background focus:w-64 md:focus:w-72 transition-all"
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
                  onClick={() => { setSearchQuery(''); setSearchResults([]); setIsSearchPopoverOpen(false); }}
                >
                  <XIcon className="h-4 w-4"/>
                </Button>
              )}
            </div>
            {isSearchPopoverOpen && (searchQuery.trim().length >= 2) && (
              <div
                ref={searchPopoverRef}
                className="absolute top-full mt-2 w-72 md:w-96 max-h-[60vh] overflow-y-auto bg-popover border border-border rounded-md shadow-lg z-[100] p-1 space-y-0.5"
              >
                {isSearchLoading && <p className="p-3 text-sm text-muted-foreground text-center">Searching...</p>}
                {!isSearchLoading && searchResults.length === 0 && (
                  <p className="p-3 text-sm text-muted-foreground text-center">No results found for "{searchQuery}".</p>
                )}
                {!isSearchLoading && searchResults.map(item => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="p-2.5 hover:bg-accent rounded cursor-pointer flex items-start"
                    onClick={() => handleNavigateToItem(item)}
                  >
                    {getIconForType(item.type)}
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-popover-foreground leading-tight truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {item.type} in <span className="font-medium">{item.category}</span>
                        {item.date && ` - ${new Date(item.date).toLocaleDateString('en-US', { month:'short', day:'numeric' })}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {status === "loading" ? (
          <div className="w-9 h-9 bg-muted animate-pulse rounded-full"></div>
        ) : session?.user ? (
          <>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Welcome, {session.user.name || session.user.email?.split('@')[0]}
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent-foreground" title="Customize Theme">
                  <PaletteIcon className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <ThemeCustomizer />
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: '/landing' })}
              className="text-muted-foreground hover:text-accent-foreground"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </>
        ) : (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent-foreground" title="Customize Theme">
                  <PaletteIcon className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <ThemeCustomizer />
              </PopoverContent>
            </Popover>
            <Link href="/login" legacyBehavior>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent-foreground" title="Sign In">
                <LogIn className="w-5 h-5" />
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

```

## src/components/layout/ProjectSelectorBar.tsx

```typescript
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Cog } from 'lucide-react';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectSelectorBarProps {
  currentCategory: Category;
  onCategoryChange: (category: Category) => void;
  availableCategories: Category[];
  // onManageProjects: () => void; 
}

export function ProjectSelectorBar({ 
  currentCategory, 
  onCategoryChange, 
  availableCategories 
}: ProjectSelectorBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSelectCategory = (category: Category | null) => {
    onCategoryChange(category || "All Projects" as Category);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        pillRef.current && !pillRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayCategoryName = currentCategory === "All Projects" ? "All Projects" : currentCategory;


  return (
    <div 
      className={cn(
        "fixed left-0 right-0 z-[90]",
        "bg-background", // Use themed background
       // Add bottom border to match header style for integration
        // "shadow-[0_2px_5px_rgba(0,0,0,0.1)]", // Shadow removed for less separation
        "flex items-center justify-center"
      )}
      style={{ top: '5rem' }} 
    >
      <div className="relative">
        <div
          ref={pillRef}
          onClick={toggleDropdown}
          className={cn(
            "bg-widget-bg border border-border", // Use themed widget-bg and border
            "rounded-full px-5 py-2",
            "text-sm font-medium cursor-pointer text-foreground", // Use themed text
            "flex items-center min-w-[220px] justify-between",
            "transition-colors duration-200 hover:border-primary hover:bg-accent" // Use themed primary/accent
          )}
        >
          <span>{displayCategoryName}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>

        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className={cn(
              "absolute mt-2 bg-popover border border-border rounded-md", // Use themed popover and border
              "w-[250px] max-h-[300px] overflow-y-auto text-popover-foreground", // Use themed text
              "shadow-[0_8px_25px_rgba(0,0,0,0.4)] z-[100]", // Keep shadow for dropdown itself
              "transition-all duration-200 ease-out",
              isDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2.5"
            )}
            style={{ top: 'calc(100% + 0.5rem)'}} 
          >
            <div 
              className={cn(
                "px-4 py-2.5 cursor-pointer text-sm",
                (currentCategory === "All Projects" || !availableCategories.includes(currentCategory as Category)) 
                  ? "bg-accent text-accent-foreground font-medium" 
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => handleSelectCategory("All Projects" as Category)}
            >
              All Projects
            </div>
            {availableCategories.map(cat => (
              <div
                key={cat}
                className={cn(
                  "px-4 py-2.5 cursor-pointer text-sm",
                  currentCategory === cat 
                    ? "bg-accent text-accent-foreground font-medium" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => handleSelectCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
        )}
      </div>
       <button 
        title="Manage Projects" 
        className="ml-3 p-2 rounded-full hover:bg-input-bg text-muted-foreground hover:text-accent-foreground" // Use themed colors
      >
        <Cog className="w-5 h-5" />
      </button>
    </div>
  );
}

```

## src/components/layout/ThemeCustomizer.tsx

```typescript
"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { themes } from '@/lib/themes';
import { availableFonts } from '@/lib/fonts';
import { Button } from '@/components/ui/button';
import { CheckIcon, MoonIcon, SunIcon, PaletteIcon, CaseSensitiveIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ThemeCustomizer() {
  const { themeKey, fontKey, mode, setTheme, setFont, toggleMode, currentTheme } = useTheme();

  return (
    <div className="p-4 space-y-6 bg-popover text-popover-foreground rounded-md shadow-lg border border-border w-72">
      <div>
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">Color Theme</h4>
        <div className="grid grid-cols-3 gap-2">
          {themes.map((themeOption) => (
            <Button
              key={themeOption.key}
              variant="outline"
              size="sm"
              onClick={() => setTheme(themeOption.key)}
              className={cn(
                "justify-start h-10",
                themeKey === themeOption.key && "border-2 border-primary ring-2 ring-ring"
              )}
              style={{ backgroundColor: themeOption.previewColor }}
              title={themeOption.displayName}
            >
              <span
                className={cn(
                  "mr-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                )}
                style={{ backgroundColor: themeOption.previewColor }}
              >
                {themeKey === themeOption.key && <CheckIcon className="h-4 w-4 text-white mix-blend-difference" />}
              </span>
              {/* <span className="text-xs text-white mix-blend-difference">{themeOption.displayName}</span> */}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">Font</h4>
        <Select value={fontKey} onValueChange={setFont}>
          <SelectTrigger>
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent className="z-[999]">
            {availableFonts.map((fontOption) => (
              <SelectItem key={fontOption.key} value={fontOption.key} style={fontOption.previewStyle}>
                {fontOption.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">Mode</h4>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => toggleMode()} className="w-full">
            {mode === 'light' ? <SunIcon className="mr-2 h-4 w-4" /> : <MoonIcon className="mr-2 h-4 w-4" />}
            {mode === 'light' ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      </div>
    </div>
  );
}

```

## src/context/ThemeContext.tsx

```typescript
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { themes, defaultThemeKey, Theme, ColorSet } from '@/lib/themes';
import { availableFonts, defaultFontKey, FontConfig } from '@/lib/fonts';

type ThemeMode = 'light' | 'dark';

interface ThemeContextState {
  themeKey: string;
  fontKey: string;
  mode: ThemeMode;
  currentTheme: Theme;
  currentFont: FontConfig;
}

interface ThemeContextType extends ThemeContextState {
  setTheme: (themeKey: string) => void;
  setFont: (fontKey: string) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const LS_THEME_KEY = 'ayanda-theme-key';
const LS_FONT_KEY = 'ayanda-font-key';
const LS_MODE_KEY = 'ayanda-theme-mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeKey, setThemeKeyState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(LS_THEME_KEY) || defaultThemeKey;
    }
    return defaultThemeKey;
  });

  const [fontKey, setFontKeyState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(LS_FONT_KEY) || defaultFontKey;
    }
    return defaultFontKey;
  });

  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const storedMode = localStorage.getItem(LS_MODE_KEY) as ThemeMode;
      if (storedMode) return storedMode;
      // return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark'; // Default to dark mode
  });
  
  // Effect for initializing from localStorage and applying theme on first load
  // This helps with FOUT prevention strategy.
  useEffect(() => {
    const root = document.documentElement;
    const initialTheme = themes.find(t => t.key === themeKey) || themes.find(t => t.key === defaultThemeKey)!;
    const initialFont = availableFonts.find(f => f.key === fontKey) || availableFonts.find(f => f.key === defaultFontKey)!;
    
    // Apply colors
    const colorsToApply: ColorSet = mode === 'dark' ? initialTheme.dark : initialTheme.light;
    for (const [key, value] of Object.entries(colorsToApply)) {
      root.style.setProperty(key.startsWith('--') ? key : `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
    }
    
    // Apply font
    root.style.setProperty('--font-selected-app', `var(${initialFont.variableName})`);
    
    // Apply mode class
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []); // Runs once on mount client-side


  // Effect for persisting and applying changes whenever state changes
  useEffect(() => {
    const root = document.documentElement;
    const selectedTheme = themes.find(t => t.key === themeKey) || themes.find(t => t.key === defaultThemeKey)!;
    const selectedFont = availableFonts.find(f => f.key === fontKey) || availableFonts.find(f => f.key === defaultFontKey)!;

    // Apply colors
    const colorsToApply: ColorSet = mode === 'dark' ? selectedTheme.dark : selectedTheme.light;
     for (const [key, value] of Object.entries(colorsToApply)) {
      // Ensure CSS variable names are correctly formatted (e.g., backgroundColorVal -> --background-color-val)
      // Also handle direct CSS var names like '--background'
      const cssVarName = key.startsWith('--') ? key : `--${key.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`)}`;
      root.style.setProperty(cssVarName, value);
    }

    // Apply font
    root.style.setProperty('--font-selected-app', `var(${selectedFont.variableName})`);
    
    // Apply mode class
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Persist
    localStorage.setItem(LS_THEME_KEY, themeKey);
    localStorage.setItem(LS_FONT_KEY, fontKey);
    localStorage.setItem(LS_MODE_KEY, mode);

  }, [themeKey, fontKey, mode]);

  const setTheme = useCallback((newThemeKey: string) => {
    setThemeKeyState(newThemeKey);
  }, []);

  const setFont = useCallback((newFontKey: string) => {
    setFontKeyState(newFontKey);
  }, []);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  }, []);

  const currentTheme = themes.find(t => t.key === themeKey) || themes.find(t => t.key === defaultThemeKey)!;
  const currentFont = availableFonts.find(f => f.key === fontKey) || availableFonts.find(f => f.key === defaultFontKey)!;

  const value: ThemeContextType = {
    themeKey,
    fontKey,
    mode,
    currentTheme,
    currentFont,
    setTheme,
    setFont,
    setMode,
    toggleMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// FOUT Prevention Script Injector
export const FOUTPreventionScript = () => {
    const script = `
      (function() {
        try {
          const themeKey = localStorage.getItem('${LS_THEME_KEY}') || '${defaultThemeKey}';
          const fontKey = localStorage.getItem('${LS_FONT_KEY}') || '${defaultFontKey}';
          let mode = localStorage.getItem('${LS_MODE_KEY}');
          if (!mode) {
            // mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            mode = 'dark'; // Default to dark
          }

          const themes = ${JSON.stringify(themes)};
          const fonts = ${JSON.stringify(availableFonts)};

          const selectedTheme = themes.find(t => t.key === themeKey) || themes.find(t => t.key === '${defaultThemeKey}');
          const selectedFont = fonts.find(f => f.key === fontKey) || fonts.find(f => f.key === '${defaultFontKey}');
          
          const root = document.documentElement;

          if (selectedTheme) {
            const colorsToApply = mode === 'dark' ? selectedTheme.dark : selectedTheme.light;
            for (const [key, value] of Object.entries(colorsToApply)) {
                const cssVarName = key.startsWith('--') ? key : '--' + key.replace(/([A-Z])/g, (match) => '-' + match.toLowerCase());
                root.style.setProperty(cssVarName, value);
            }
          }

          if (selectedFont) {
            root.style.setProperty('--font-selected-app', 'var(' + selectedFont.variableName + ')');
          }
          
          if (mode === 'dark') {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        } catch (e) {
          console.error('Error applying initial theme:', e);
        }
      })();
    `;
    return <script dangerouslySetInnerHTML={{ __html: script }} />;
};

```

## src/types/index.ts

```
import { User as NextAuthUser } from 'next-auth';

export interface RecurrenceRule {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // e.g., every 1 day, every 2 weeks
  daysOfWeek?: number[]; // 0 (Sun) to 6 (Sat), for weekly
  dayOfMonth?: number; // 1-31, for monthly
  monthOfYear?: number; // 1-12, for yearly on a specific month/day
  endDate?: string; // YYYY-MM-DD, optional end date for recurrence
  count?: number; // Optional number of occurrences
}

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  userId: string;
  text: string;
  completed: boolean;
  dueDate?: string; // YYYY-MM-DD format (start date for recurring)
  category: string;
  recurrenceRule?: RecurrenceRule;
  subTasks?: SubTask[];
  createdAt?: string; // Mongoose adds this as Date, will be string in JSON
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  category: string;
  createdAt?: string; // Added for consistency if needed for sorting
}

export interface Note {
  id: string;
  userId: string;
  title?: string;
  content: string; // Will store Markdown content
  category: string;
  lastEdited: string; // ISO string (Mongoose 'updatedAt' can serve this role too)
  createdAt?: string; // Added for consistency
}

export interface Event {
  id:string;
  userId: string;
  title: string;
  date: string; // ISO string for the event's date and time
  duration?: number; // in minutes
  description?: string;
  category: string;
  recurrenceRule?: RecurrenceRule;
  createdAt?: string; // Added for consistency
}


export type ViewMode = "dashboard" | "tasks" | "goals" | "notes" | "calendar";

export type Category = "All Projects" | "Personal Life" | "Work" | "Studies";

// For NextAuth session and JWT
export interface AuthenticatedUser extends NextAuthUser {
  id: string;
  email: string;
  name?: string | null;
}

// For Global Search Results
export interface SearchResultItem {
  id: string;
  type: 'task' | 'goal' | 'note' | 'event';
  title: string;
  category: Category;
  date?: string;
  contentPreview?: string;
  path: string;
}



```

## src/app/favicon.ico

```
**Note:** File appears to be binary or uses an incompatible encoding.
Content not displayed.
```

## src/app/globals.css

```css
@import "tailwindcss";
@theme inline {
  --color-background: var(--background);
  /* Shadcn/ui compatibility - Aliases pointing to AYANDA source variables */
  /* These tell Tailwind how to interpret its own utility classes like bg-popover */
  --background: var(--background-color-val);
  --foreground: var(--text-color-val);
  --card: pink;
  --card-foreground: var(--text-color-val);
  --popover: green;
  --popover-foreground:white;
  --primary: var(--accent-color-val);
  --primary-foreground: var(--primary-foreground-val); /* Using a dedicated var for primary foreground */
  --secondary: var(--input-bg-val);
  --secondary-foreground: var(--text-color-val);
  --muted: var(--input-bg-val);
  --muted-foreground: var(--text-muted-color-val);
  --accent: hsl(var(--accent-color-hsl) / 0.1);
  --accent-foreground: var(--accent-color-val);
  --destructive: var(--danger-color-val);
  --destructive-foreground: var(--text-color-val);
  --border: var(--border-color-val);
  --input: var(--border-color-val); /* Input border often same as general border */
  --ring: hsl(var(--accent-color-hsl) / 0.5);
  --radius: 0.75rem;
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);





  
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);


  /* AYANDA source variables - DECLARE them for Tailwind's awareness. */
  /* Actual default values are in :root. JS will override :root values. */
  /* Declaring them here (even empty) helps Tailwind's JIT and theme() function. */
  --accent-color-val: ;
  --accent-color-hsl: ;
  --primary-foreground-val: ; /* Dedicated variable for text on primary elements */
  --background-color-val: ;
  --widget-background-val: ;
  --text-color-val: ;
  --text-muted-color-val: ;
  --border-color-val: ;
  --input-bg-val: ;
  --danger-color-val: ;

  /* Fonts */
  --font-sans: var(--font-selected-app), var(--font-inter);
  --font-orbitron: var(--font-orbitron-val);
  --font-inter: Inter, sans-serif;
  --font-geist-sans: GeistSans, sans-serif;
  --font-manrope: Manrope, sans-serif;
  --font-lexend: Lexend, sans-serif;
  --font-poppins: Poppins, sans-serif;
  --font-jetbrains-mono: 'JetBrains Mono', monospace;
  --font-lora: Lora, serif;
}

/* Default values set on :root. ThemeProvider will override these dynamically. */
:root {
  /* AYANDA source variables */
  --accent-color-val: #00DCFF; /* Default Cyan */
  --accent-color-hsl: 190 100% 50%; 
  --primary-foreground-val: #0A0F14; /* Default: Dark text for light primary (like Default Cyan's primary button) */
  
  --background-color-val: #0A0F14; /* Default Dark: Very Dark Blue/Gray */
  --widget-background-val: #101820; /* Default Dark: Widget Background */
  --text-color-val: #E0E7FF; /* Default Dark: Soft Lavender White */
  --text-muted-color-val: #707A8A; /* Default Dark: Muted Blue/Gray */
  --border-color-val: rgba(0, 220, 255, 0.12); /* Default Dark: Border (was 0.08) */
  --input-bg-val: rgba(255, 255, 255, 0.03); /* Default Dark: Input Background */
  --danger-color-val: #FF4757;

  /* Font variable that ThemeProvider will update */
  --font-selected-app: var(--font-inter);
}

/*
  When .dark class is applied by ThemeProvider:
  These values are the defaults for dark mode if the theme object doesn't specify them,
  OR they are what the theme object's "dark" mode specifically sets for these source variables.
  The createThemeColors function in themes.ts already defines dark mode values for each theme.
  This .dark:root block is mostly a fallback or for global dark mode overrides
  not tied to a specific theme's dark ColorSet.
  Given our themes.ts defines dark mode explicitly, this block might be redundant
  unless you have global dark styles independent of the theme choice.
*/
.dark:root {
  /* Default Dark Theme (if not overridden by a specific theme's dark mode) */
  --accent-color-val: #00DCFF;
  --accent-color-hsl: 190 100% 50%;
  --primary-foreground-val: #0A0F14; /* Text on primary */

  --background-color-val: #0A0F14;
  --widget-background-val: #101820;
  --text-color-val: #E0E7FF;
  --text-muted-color-val: #707A8A;
  --border-color-val: rgba(0, 220, 255, 0.12);
  --input-bg-val: rgba(255, 255, 255, 0.03);
  /* danger-color usually stays the same or has a specific dark variant */
}


@layer base {
  body {
    font-family: theme('fontFamily.sans');
    background-color: var(--background); /* Use the aliased shadcn variable */
    color: var(--foreground);       /* Use the aliased shadcn variable */
    overflow-x: hidden;
  }
  * {
     border-color: var(--border); /* For shadcn components that expect --border */

  }
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  ::-webkit-scrollbar-track {
    background: hsl(var(--accent-color-hsl) / 0.05); /* Track slightly tinted */
  }
  ::-webkit-scrollbar-thumb {
    background: hsl(var(--accent-color-hsl) / 0.4); /* Thumb more visible */
    border-radius: 2px;
  }
  * {
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--accent-color-hsl) / 0.4) hsl(var(--accent-color-hsl) / 0.05);
  }
}

@layer components {
  .widget-item {
    background-color: var(--input-bg-val); /* Uses AYANDA source variable */
    padding: 0.625rem 0.875rem; 
    border-radius: 0.375rem; 
    font-size: 0.875rem; 
    border-left: 3px solid transparent;
    transition-property: border-color, background-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
    word-break: break-word;
  }
  .widget-item:hover {
    border-left-color: var(--accent-color-val); 
    background-color: hsl(var(--accent-color-hsl) / 0.05); 
  }

  .input-field {
    @apply bg-[var(--input-bg-val)] border-[var(--border-color-val)] text-[var(--text-color-val)] placeholder:text-[var(--text-muted-color-val)];
    @apply focus:border-[var(--accent-color-val)] focus:ring-1 focus:ring-[var(--accent-color-val)]/50;
  }
  
  .btn-primary {
    @apply bg-[var(--accent-color-val)] text-[var(--primary-foreground-val)] hover:opacity-90;
  }
  .btn-icon {
    @apply text-[var(--text-muted-color-val)] hover:text-[var(--accent-color-val)];
  }
  .btn-icon.danger {
     @apply hover:text-[var(--danger-color-val)];
  }
}

@layer utilities {
    .font-orbitron { font-family: theme('fontFamily.orbitron'); }
    .accent-text { color: var(--accent-color-val); }
}
```

## src/app/layout.tsx

```typescript
import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import AuthSessionProvider from "@/components/auth/AuthSessionProvider";
import { ThemeProvider, FOUTPreventionScript } from "@/context/ThemeContext";
import {
  inter,
  orbitronFont,
  geistSans,
  manrope,
  lexend,
  poppins,
  jetbrainsMono,
  lora
} from '@/lib/fonts';

export const metadata: Metadata = {
  title: "AYANDA",
  description: "Your personal assistant and dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* suppressHydrationWarning for FOUT script + theme provider */}
      <head>
        <FOUTPreventionScript />
      </head>
      <body
        className={cn(
          // Font variables are applied here, --font-selected-app in globals.css will pick one
          inter.variable,
          orbitronFont.variable,
          geistSans.variable,
          manrope.variable,
          lexend.variable,
          poppins.variable,
          jetbrainsMono.variable,
          lora.variable,
          "antialiased min-h-screen bg-background text-foreground" // Use shadcn vars for base
        )}
      >
        <AuthSessionProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}

```

## src/app/page.tsx

```typescript
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react'; 
import { usePathname, useRouter, useSearchParams } from 'next/navigation'; 

import { Header } from '@/components/layout/Header';
import { ProjectSelectorBar } from '@/components/layout/ProjectSelectorBar';
import { FooterChat } from '@/components/layout/FooterChat';
import { AiAssistantWidget } from '@/components/dashboard/AiAssistantWidget';
import { TasksWidget } from '@/components/dashboard/TasksWidget';
import { CalendarWidget } from '@/components/dashboard/CalendarWidget';
import { GoalsWidget } from '@/components/dashboard/GoalsWidget';
import { QuickNotesWidget } from '@/components/dashboard/QuickNotesWidget';
import { DueSoonWidget } from '@/components/dashboard/DueSoonWidget';
import { TasksView } from '@/components/views/TasksView';
import { GoalsView } from '@/components/views/GoalsView';
import { NotesView } from '@/components/views/NotesView';
import { CalendarFullScreenView } from '@/components/views/CalendarFullScreenView';
import { Task, Goal, Note, Event as AppEvent, ViewMode, Category, RecurrenceRule, SubTask } from '@/types';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

const baseAvailableCategories: Category[] = ["Personal Life", "Work", "Studies"];
const availableCategoriesForDropdown: Category[] = ["All Projects", ...baseAvailableCategories];

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  
  const [currentCategory, setCurrentCategory] = useState<Category>("All Projects");

  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  useEffect(() => {
    const view = searchParams.get('view') as ViewMode | null;
    if (view && ['tasks', 'goals', 'notes', 'calendar'].includes(view)) {
      setViewMode(view);
    }
  }, [searchParams]);

  useEffect(() => {
    if (status === "loading") return; 
    if (!session && status === "unauthenticated") {
      router.replace(`/login?callbackUrl=${pathname}`); 
    } else if (session && status === "authenticated" && !initialLoadDone) {
      setInitialLoadDone(true); 
    }
  }, [session, status, router, initialLoadDone, pathname]);

  const fetchData = useCallback(async (categorySignal?: Category) => {
    if (status !== "authenticated") return; 
    
    setIsLoading(true);
    const categoryToFetch = categorySignal || currentCategory;
    const queryCategory = categoryToFetch === "All Projects" ? "" : `?category=${encodeURIComponent(categoryToFetch)}`;
    
    try {
      const [tasksRes, goalsRes, notesRes, eventsRes] = await Promise.all([
        fetch(`/api/tasks${queryCategory}`),
        fetch(`/api/goals${queryCategory}`),
        fetch(`/api/notes${queryCategory}`),
        fetch(`/api/events${queryCategory}`),
      ]);

      const checkOk = (res: Response, name: string) => {
          if(!res.ok) console.error(`Failed to fetch ${name}: ${res.status} ${res.statusText} - ${res.url}`);
          return res.ok;
      }
      
      if (checkOk(tasksRes, 'tasks') && checkOk(goalsRes, 'goals') && checkOk(notesRes, 'notes') && checkOk(eventsRes, 'events')) {
        const tasksData = await tasksRes.json();
        const goalsData = await goalsRes.json();
        const notesData = await notesRes.json();
        const eventsData = await eventsRes.json();

        setTasks(tasksData);
        setGoals(goalsData);
        setNotes(notesData);
        setEvents(eventsData);
      } else {
         setAiMessage("Error fetching some data. Dashboard might be incomplete.");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setAiMessage("Network error fetching data.");
    } finally {
      setIsLoading(false);
    }
  }, [currentCategory, status]); 

  useEffect(() => {
    if (initialLoadDone && status === "authenticated") { 
        fetchData();
    }
  }, [fetchData, initialLoadDone, status]); 

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'completed' | 'userId' | 'createdAt'>) => {
    if (status !== "authenticated") return;
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (res.ok) {
        fetchData(currentCategory);
        setAiMessage(`Task "${taskData.text.substring(0,30)}..." added.`);
    } else { setAiMessage(`Failed to add task.`); }
  };

  const handleToggleTask = async (taskId: string, subTaskId?: string) => {
    if (status !== "authenticated") return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    let updatePayload: Partial<Task>;

    if (subTaskId) {
        // Toggle a subtask
        const updatedSubTasks = (task.subTasks || []).map(st => 
            st.id === subTaskId ? { ...st, completed: !st.completed } : st
        );
        updatePayload = { subTasks: updatedSubTasks };
        // Check if all subtasks are completed to mark parent task as completed
        const allSubTasksCompleted = updatedSubTasks.every(st => st.completed);
        if (updatedSubTasks.length > 0 && allSubTasksCompleted !== task.completed) {
            updatePayload.completed = allSubTasksCompleted;
        }
    } else {
        // Toggle the parent task
        updatePayload = { completed: !task.completed };
        // If parent task is marked complete, all subtasks should also be marked complete
        // If parent task is marked incomplete, subtasks remain as they are (or could be all marked incomplete too - user preference)
        if (updatePayload.completed && task.subTasks && task.subTasks.length > 0) {
            updatePayload.subTasks = task.subTasks.map(st => ({ ...st, completed: true }));
        }
    }
    
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload),
    });
    if (res.ok) fetchData(currentCategory);
    else setAiMessage("Failed to toggle task.");
  };

  const handleDeleteTask = async (taskId: string) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Task deleted.`); } 
    else { setAiMessage(`Failed to delete task.`); }
  };
  
  const handleUpdateTask = async (taskId: string, taskUpdateData: Partial<Omit<Task, 'id' | 'userId'>>) => {
    if (status !== "authenticated") return;
    // Ensure subtasks being sent for update have IDs
    if (taskUpdateData.subTasks) {
        taskUpdateData.subTasks = taskUpdateData.subTasks.map(st => ({
            ...st,
            id: st.id || uuidv4() // Assign ID if missing (e.g., newly added subtask in edit modal)
        }));
    }
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskUpdateData),
    });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Task updated.`); } 
    else { setAiMessage(`Failed to update task.`); }
  };

  const handleAddGoal = async (name: string, targetValue: number, unit: string, category: Category) => {
    if (status !== "authenticated") return;
    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, currentValue: 0, targetValue, unit, category }),
    });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Goal "${name.substring(0,30)}..." added.`); } 
    else { setAiMessage(`Failed to add goal.`); }
  };

  const handleUpdateGoal = async (goalId: string, currentValue?: number, name?: string, targetValue?: number, unit?: string, categoryProp?: Category) => {
    if (status !== "authenticated") return;
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    const payload: any = { name: name ?? goal.name, unit: unit ?? goal.unit, category: categoryProp ?? goal.category };
    if(targetValue !== undefined) payload.targetValue = targetValue; else payload.targetValue = goal.targetValue;
    if(currentValue !== undefined) payload.currentValue = Math.max(0, Math.min(currentValue, payload.targetValue)); else payload.currentValue = goal.currentValue;

    const res = await fetch(`/api/goals/${goalId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Goal updated.`); } 
    else { setAiMessage(`Failed to update goal.`); }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/goals/${goalId}`, { method: 'DELETE' });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Goal deleted.`); } 
    else { setAiMessage(`Failed to delete goal.`); }
  };
  
  const handleAddNote = async (title: string | undefined, content: string, category: Category) => {
    if (status !== "authenticated") return;
    const res = await fetch('/api/notes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content, category }),
    });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Note "${(title || content).substring(0,20)}..." added.`); } 
    else { setAiMessage(`Failed to add note.`); }
  };

  const handleUpdateNote = async (noteId: string, title: string | undefined, content: string, categoryProp?: Category) => {
     if (status !== "authenticated") return;
     const note = notes.find(n => n.id === noteId);
     if (!note) return;
    const res = await fetch(`/api/notes/${noteId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content, category: categoryProp || note.category }),
    });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Note updated.`); } 
    else { setAiMessage(`Failed to update note.`); }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Note deleted.`); } 
    else { setAiMessage(`Failed to delete note.`); }
  };

  const handleAddEvent = async (eventData: Omit<AppEvent, 'id' | 'userId' | 'createdAt'>) => {
    if (status !== "authenticated") return;
    const res = await fetch('/api/events', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(eventData),
    });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Event "${eventData.title.substring(0,30)}..." added.`); } 
    else { setAiMessage(`Failed to add event.`); }
  };
  
  const handleUpdateEvent = async (eventId: string, eventUpdateData: Partial<Omit<AppEvent, 'id' | 'userId'>>) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/events/${eventId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(eventUpdateData),
    });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Event updated.`); } 
    else { setAiMessage(`Failed to update event.`); }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (status !== "authenticated") return;
    const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
    if (res.ok) { fetchData(currentCategory); setAiMessage(`Event deleted.`); } 
    else { setAiMessage(`Failed to delete event.`); }
  };

  const handleAiInputCommand = async (command: string) => {
    if (status !== "authenticated") return;
    setIsLoading(true); 
    setAiMessage(`AIDA is processing your command...`); 

    const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, currentCategory }),
    });
    
    if (res.ok) {
        const result = await res.json();
        setAiMessage(result.message || "AI command processed.");
        fetchData(currentCategory); 
    } else {
        const errorResult = await res.json().catch(() => ({message: "AI command failed with an unknown error."}));
        setAiMessage(errorResult.message || "AI command failed.");
    }
    setIsLoading(false);
  };

  const onCategoryChange = (category: Category) => {
    setCurrentCategory(category);
    setAiMessage(null); 
  };

  const navigateToItemHandler = (type: 'tasks' | 'calendar' | 'notes' | 'goals', id: string) => {
    // This handler is for the DueSoonWidget to navigate to the full view
    // It might need to also pass the ID to the view or handle focusing the item
    setViewMode(type); 
    router.push(`/?view=${type}&id=${id}`, { scroll: false }); // Update URL for potential deep linking
  };

  const renderView = () => {
    const commonViewProps = {
        categories: baseAvailableCategories,
        currentCategory: (currentCategory === "All Projects" || !baseAvailableCategories.includes(currentCategory)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : currentCategory,
        onClose: () => { setViewMode('dashboard'); setAiMessage(null); router.push('/', { scroll: false }); },
    };
    
    const dashboardDataProps = {
      tasks: tasks.filter(t => currentCategory === "All Projects" || t.category === currentCategory),
      goals: goals.filter(g => currentCategory === "All Projects" || g.category === currentCategory),
      notes: notes.filter(n => currentCategory === "All Projects" || n.category === currentCategory).sort((a,b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()),
      events: events.filter(e => currentCategory === "All Projects" || e.category === currentCategory),
    };
    
    switch (viewMode) {
      case 'tasks':
        return <TasksView {...commonViewProps} tasks={tasks} onAddTask={handleAddTask} onToggleTask={handleToggleTask} onDeleteTask={handleDeleteTask} onUpdateTask={handleUpdateTask} />;
      case 'goals':
        return <GoalsView {...commonViewProps} goals={goals} onAddGoal={handleAddGoal} onUpdateGoal={handleUpdateGoal} onDeleteGoal={handleDeleteGoal} />;
      case 'notes':
        return <NotesView {...commonViewProps} notes={notes} onAddNote={handleAddNote} onUpdateNote={handleUpdateNote} onDeleteNote={handleDeleteNote} />;
      case 'calendar':
        return <CalendarFullScreenView {...commonViewProps} events={events} onAddEvent={handleAddEvent} onUpdateEvent={handleUpdateEvent} onDeleteEvent={handleDeleteEvent} />;
      case 'dashboard':
      default:
        if (isLoading && !initialLoadDone) {
            return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p className="text-xl accent-text">Loading Dashboard...</p></div>;
        }
        if (status === "unauthenticated") { 
            return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><p className="text-xl accent-text">Redirecting to login...</p></div>;
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              <div className="lg:row-span-2 flex flex-col gap-5 md:gap-6">
                <AiAssistantWidget message={aiMessage} />
                <TasksWidget 
                    tasks={dashboardDataProps.tasks} 
                    onTaskToggle={handleToggleTask} 
                    onNavigate={() => { setViewMode('tasks'); router.push('/?view=tasks', { scroll: false }); }}
                    className="flex-grow"
                />
              </div>
              <div className="flex flex-col space-y-5 md:space-y-6">
                <CalendarWidget events={dashboardDataProps.events} onNavigate={() => { setViewMode('calendar'); router.push('/?view=calendar', { scroll: false }); }} />
                <DueSoonWidget 
                    tasks={tasks} 
                    events={events} 
                    currentProjectId={currentCategory === "All Projects" ? null : currentCategory} 
                    onNavigateToItem={navigateToItemHandler}
                />
              </div>
              <GoalsWidget goals={dashboardDataProps.goals} onNavigate={() => { setViewMode('goals'); router.push('/?view=goals', { scroll: false }); }} />
              <QuickNotesWidget notes={dashboardDataProps.notes} onNavigate={() => { setViewMode('notes'); router.push('/?view=notes', { scroll: false }); }} />
            </div>
        );
    }
  };

  if (status === "loading" && !initialLoadDone) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow px-6 pb-24 pt-[calc(5rem+2.875rem+0.75rem)] flex justify-center items-center"> 
                <p className="text-xl accent-text">Initializing AYANDA...</p>
            </main>
        </div>
    );
  }
  if (status === "unauthenticated" && (pathname === "/" || !["/login", "/register", "/landing"].includes(pathname))) {
     return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow px-6 pb-24 pt-[calc(5rem+2.875rem+0.75rem)] flex justify-center items-center"> 
                <p className="text-xl accent-text">Redirecting to login...</p>
            </main>
        </div>
     );
  }

  const showProjectBar = status === "authenticated" && !["/login", "/register", "/landing"].includes(pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {showProjectBar && (
         <ProjectSelectorBar 
            currentCategory={currentCategory}
            onCategoryChange={onCategoryChange}
            availableCategories={availableCategoriesForDropdown}
          />
      )}
      <main 
        className={cn(
            "flex-grow px-6 pb-24",
            viewMode !== 'dashboard' ? "pt-[5rem]" : 
            showProjectBar ? "pt-[calc(5rem+2.875rem+1.5rem)]" : "pt-[calc(5rem+1.5rem)]"
        )}
      >
        {renderView()}
      </main>
      {status === "authenticated" && <FooterChat onSendCommand={handleAiInputCommand} />}
    </div>
  );
}



```

## src/app/landing/page.tsx

```typescript
import React from 'react';
import { Header } from '@/components/layout/Header'; // Assuming Header handles its own auth logic
import { FooterChat } from '@/components/layout/FooterChat'; // Assuming this is fine for landing
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Metadata } from 'next';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'AYANDA | Your Intelligent Personal Assistant',
  description: 'AYANDA helps you manage tasks, goals, notes, and events with AI. Streamline your productivity and organize your life effortlessly.',
  keywords: 'AI assistant, personal dashboard, task management, goal tracking, note taking, event scheduling, productivity app',
};


export default function LandingPage() {
  // The onSendCommand for FooterChat on a landing page might not be relevant
  // or could be a no-op / log to console / specific landing page action
  const handleLandingPageCommand = (command: string) => {
    console.log("Landing page AI command attempt:", command);
    // Perhaps redirect to login or show a message that AI features are for logged-in users
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background-color-val)] text-[var(--text-color-val)]">
      <Header />
      <main className="flex-grow pt-[5rem]"> {/* Adjust pt if header height changes */}
        <HeroSection />
        <FeaturesSection />
        
        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-[var(--background-color-val)]">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-6">
              Ready to Supercharge Your Productivity?
            </h2>
            <p className="text-lg text-[var(--text-muted-color-val)] mb-8 max-w-xl mx-auto">
              Join AYANDA today and transform the way you manage your life and work.
            </p>
            <Link href="/register" legacyBehavior>
              <Button size="lg" className="btn-primary text-lg px-10 py-6 animate-bounce">
                Sign Up Now - It&apos;s Free!
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer Section - Basic */}
        <footer className="py-8 border-t border-[var(--border-color-val)] bg-[var(--widget-background-val)]">
            <div className="container mx-auto px-6 text-center text-sm text-[var(--text-muted-color-val)]">
                &copy; {new Date().getFullYear()} AYANDA. All rights reserved.
                {/* Add more links if needed, e.g., Privacy Policy, Terms of Service */}
            </div>
        </footer>
      </main>
      {/* FooterChat might be conditionally rendered or have different behavior on landing */}
      {/* <FooterChat onSendCommand={handleLandingPageCommand} /> */}
    </div>
  );
}

```

## src/app/register/page.tsx

```typescript
"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AyandaLogoIcon } from '@/components/layout/AyandaLogoIcon';
import { v4 as uuidv4 } from 'uuid';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', { // We'll create this API route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: uuidv4(), name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed. Please try again.");
      } else {
        // Optionally sign in the user automatically after registration
        const signInResult = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });
        if (signInResult?.ok) {
          router.push('/'); // Redirect to dashboard
        } else {
          // If auto sign-in fails, redirect to login page with a success message or error
          setError(signInResult?.error || "Registration successful, but auto sign-in failed. Please log in.");
          router.push('/login?registered=true');
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background-color-val)] p-4">
      <Link href="/landing" className="flex items-center space-x-3 mb-8 cursor-pointer group">
        <AyandaLogoIcon className="group-hover:scale-110 transition-transform duration-200" />
        <h1 className="font-orbitron text-4xl font-bold tracking-wider accent-text group-hover:brightness-110 transition-all duration-200">AYANDA</h1>
      </Link>
      <Card className="w-full max-w-md bg-[var(--widget-background-val)] border-[var(--border-color-val)] shadow-2xl">
        <CardHeader className="items-center text-center">
          <CardTitle className="font-orbitron text-2xl accent-text">Create Account</CardTitle>
          <CardDescription className="text-[var(--text-muted-color-val)]">
            Join AYANDA to organize your life.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--text-color-val)]">Full Name (Optional)</label>
              <Input id="name" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Your Name"/>
            </div>
            <div>
              <label htmlFor="email-register" className="block text-sm font-medium text-[var(--text-color-val)]">Email Address</label>
              <Input id="email-register" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com"/>
            </div>
            <div>
              <label htmlFor="password-register" className="block text-sm font-medium text-[var(--text-color-val)]">Password</label>
              <Input id="password-register" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••"/>
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-[var(--text-color-val)]">Confirm Password</label>
              <Input id="confirm-password" name="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" placeholder="••••••••"/>
            </div>
             {error && (
              <p className="text-sm text-destructive text-center bg-destructive/10 p-2 rounded-md">{error}</p>
            )}
            <div>
              <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-center">
          <p className="text-sm text-[var(--text-muted-color-val)]">
            Already have an account?{' '}
            <Link href="/login" className="font-medium accent-text hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

```

## src/app/api/events/route.ts

```
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EventModel, { IEvent } from '@/models/EventModel';
import { Event as AppEvent, RecurrenceRule } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  try {
    const query: any = { userId };
    if (category && category !== "All Projects") {
      query.category = category;
    }
    const events: IEvent[] = await EventModel.find(query).sort({ date: 1 });
    return NextResponse.json(events, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json({ message: 'Failed to fetch events', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  try {
    const body: Omit<AppEvent, 'id' | 'userId' | 'createdAt'> & { recurrenceRule?: RecurrenceRule } = await request.json();
    const newEventData: AppEvent = {
        id: uuidv4(),
        userId: userId,
        title: body.title,
        date: body.date,
        duration: body.duration,
        description: body.description,
        category: body.category,
        recurrenceRule: body.recurrenceRule,
        // createdAt will be added by Mongoose timestamps
    };
    const event: IEvent = new EventModel(newEventData);
    await event.save();
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Failed to create event:', error);
    if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create event', error: (error as Error).message }, { status: 500 });
  }
}


```

## src/app/api/events/[id]/route.ts

```
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EventModel from '@/models/EventModel';
import { Event as AppEvent, RecurrenceRule } from '@/types';
import mongoose from 'mongoose';
import { getToken } from 'next-auth/jwt';

interface Params {
  id: string;
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userIdAuth = token.id as string;

  await dbConnect();
  const { id } = params;
  try {
    const body: Partial<Omit<AppEvent, 'id' | 'userId'>> & { recurrenceRule?: RecurrenceRule | null } = await request.json();
    
    const updatePayload: any = { ...body };
    if (body.hasOwnProperty('recurrenceRule') && !body.recurrenceRule) {
        updatePayload.$unset = { recurrenceRule: "" };
        delete updatePayload.recurrenceRule;
    }

    const updatedEvent = await EventModel.findOneAndUpdate({ id: id, userId: userIdAuth }, updatePayload, { new: true, runValidators: true });
    if (!updatedEvent) {
      return NextResponse.json({ message: 'Event not found or you do not have permission to update it.' }, { status: 404 });
    }
    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error(`Failed to update event ${id}:`, error);
     if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: `Failed to update event ${id}`, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userIdAuth = token.id as string;

  await dbConnect();
  const { id } = params;
  try {
    const deletedEvent = await EventModel.findOneAndDelete({ id: id, userId: userIdAuth });
    if (!deletedEvent) {
      return NextResponse.json({ message: 'Event not found or you do not have permission to delete it.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete event ${id}:`, error);
    return NextResponse.json({ message: `Failed to delete event ${id}`, error: (error as Error).message }, { status: 500 });
  }
}


```

## src/app/api/notes/route.ts

```
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import NoteModel, { INote } from '@/models/NoteModel';
import { Note } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  try {
    const query: any = { userId };
    if (category && category !== "All Projects") {
      query.category = category;
    }
    const notes: INote[] = await NoteModel.find(query).sort({ lastEdited: -1 });
    return NextResponse.json(notes, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    return NextResponse.json({ message: 'Failed to fetch notes', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  try {
    const body: Omit<Note, 'id' | 'lastEdited' | 'userId' | 'createdAt'> = await request.json();
    const newNoteData: Note = {
        id: uuidv4(),
        userId: userId,
        title: body.title,
        content: body.content,
        category: body.category,
        lastEdited: new Date().toISOString(),
        // createdAt will be added by Mongoose timestamps
    };
    const note: INote = new NoteModel(newNoteData);
    await note.save();
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Failed to create note:', error);
    return NextResponse.json({ message: 'Failed to create note', error: (error as Error).message }, { status: 500 });
  }
}


```

## src/app/api/notes/[id]/route.ts

```
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import NoteModel from '@/models/NoteModel';
import { Note } from '@/types';
import { getToken } from 'next-auth/jwt';

interface Params {
  id: string;
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userIdAuth = token.id as string;

  await dbConnect();
  const { id } = params;
  try {
    const body: Partial<Omit<Note, 'id' | 'userId'>> = await request.json();
    const updateData = {
      ...body,
      lastEdited: new Date().toISOString(),
    };
    const updatedNote = await NoteModel.findOneAndUpdate({ id: id, userId: userIdAuth }, updateData, { new: true, runValidators: true });
    if (!updatedNote) {
      return NextResponse.json({ message: 'Note not found or you do not have permission to update it.' }, { status: 404 });
    }
    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    console.error(`Failed to update note ${id}:`, error);
    return NextResponse.json({ message: `Failed to update note ${id}`, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userIdAuth = token.id as string;

  await dbConnect();
  const { id } = params;
  try {
    const deletedNote = await NoteModel.findOneAndDelete({ id: id, userId: userIdAuth });
    if (!deletedNote) {
      return NextResponse.json({ message: 'Note not found or you do not have permission to delete it.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Note deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete note ${id}:`, error);
    return NextResponse.json({ message: `Failed to delete note ${id}`, error: (error as Error).message }, { status: 500 });
  }
}


```

## src/app/api/tasks/route.ts

```
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TaskModel, { ITask } from '@/models/TaskModel';
import { Task, RecurrenceRule, SubTask } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  try {
    const query: any = { userId };
    if (category && category !== "All Projects") {
      query.category = category;
    }
    const tasks: ITask[] = await TaskModel.find(query).sort({ dueDate: 1, createdAt: -1 });
    return NextResponse.json(tasks, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json({ message: 'Failed to fetch tasks', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  try {
    const body: Omit<Task, 'id' | 'completed' | 'userId' | 'createdAt'> & { subTasks?: Partial<SubTask>[], recurrenceRule?: RecurrenceRule } = await request.json();
    
    const newSubTasks = (body.subTasks || []).map(sub => ({ 
        id: sub.id || uuidv4(), 
        text: sub.text || '', 
        completed: sub.completed || false 
    }));

    const newTaskData: Omit<Task, 'id'> & {userId: string} = { 
        userId: userId,
        text: body.text,
        completed: false,
        dueDate: body.dueDate,
        category: body.category,
        recurrenceRule: body.recurrenceRule,
        subTasks: newSubTasks.filter(st => st.text.trim() !== ''), // Filter out empty subtasks
        // createdAt will be added by Mongoose timestamps
    };
    
    const taskToSave : Task = {id: uuidv4(), ...newTaskData};
    const task: ITask = new TaskModel(taskToSave);
    await task.save();
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Failed to create task:', error);
    if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create task', error: (error as Error).message }, { status: 500 });
  }
}



```

## src/app/api/tasks/[id]/route.ts

```
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TaskModel from '@/models/TaskModel';
import { Task, SubTask, RecurrenceRule } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { getToken } from 'next-auth/jwt';

interface Params {
  id: string;
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userIdAuth = token.id as string;

  await dbConnect();
  const { id } = params;
  try {
    const body: Partial<Omit<Task, 'id' | 'userId'>> & { subTasks?: Partial<SubTask>[], recurrenceRule?: RecurrenceRule | null } = await request.json();

    const updatePayload: any = { ...body };
    
    // Ensure subtasks have IDs and default completion status if not provided
    if (body.subTasks) {
      updatePayload.subTasks = body.subTasks.map(sub => ({
        id: sub.id || uuidv4(),
        text: sub.text || '',
        completed: sub.completed || false,
      })).filter(st => st.text.trim() !== ''); // Filter out empty subtasks
    }
    
    if (body.hasOwnProperty('recurrenceRule') && body.recurrenceRule === null) {
        updatePayload.$unset = { recurrenceRule: "" }; // To remove the field from MongoDB doc
        delete updatePayload.recurrenceRule;
    } else if (body.recurrenceRule) {
        updatePayload.recurrenceRule = body.recurrenceRule;
    }

    // Handle case where subTasks might be explicitly set to null or empty array to clear them
    if (body.hasOwnProperty('subTasks') && (body.subTasks === null || (Array.isArray(body.subTasks) && body.subTasks.length === 0))) {
      updatePayload.subTasks = [];
    }


    const updatedTask = await TaskModel.findOneAndUpdate({ id: id, userId: userIdAuth }, updatePayload, { new: true, runValidators: true });
    if (!updatedTask) {
      return NextResponse.json({ message: 'Task not found or you do not have permission to update it.' }, { status: 404 });
    }
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error(`Failed to update task ${id}:`, error);
    if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: `Failed to update task ${id}`, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userIdAuth = token.id as string;

  await dbConnect();
  const { id } = params;
  try {
    const deletedTask = await TaskModel.findOneAndDelete({ id: id, userId: userIdAuth });
    if (!deletedTask) {
      return NextResponse.json({ message: 'Task not found or you do not have permission to delete it.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete task ${id}:`, error);
    return NextResponse.json({ message: `Failed to delete task ${id}`, error: (error as Error).message }, { status: 500 });
  }
}



```

## src/app/api/search/route.ts

```
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TaskModel from '@/models/TaskModel';
import GoalModel from '@/models/GoalModel';
import NoteModel from '@/models/NoteModel';
import EventModel from '@/models/EventModel';
import { Category, SearchResultItem } from '@/types';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized for search' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const currentCategoryFilter = searchParams.get('category') as Category | null;

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ message: 'Search query "q" must be at least 2 characters long' }, { status: 400 });
  }

  try {
    const searchRegex = { $regex: query, $options: 'i' };

    const baseQuery: any = { userId }; // Always filter by userId
    if (currentCategoryFilter && currentCategoryFilter !== "All Projects") {
      baseQuery.category = currentCategoryFilter;
    }

    const tasksPromise = TaskModel.find({ ...baseQuery, text: searchRegex }).limit(10).lean();
    const goalsPromise = GoalModel.find({ ...baseQuery, name: searchRegex }).limit(10).lean();
    const notesPromise = NoteModel.find({ ...baseQuery, $or: [{ title: searchRegex }, { content: searchRegex }] }).limit(10).lean();
    const eventsPromise = EventModel.find({ ...baseQuery, $or: [{ title: searchRegex }, { description: searchRegex }] }).limit(10).lean();

    const [tasks, goals, notes, events] = await Promise.all([
      tasksPromise,
      goalsPromise,
      notesPromise,
      eventsPromise,
    ]);

    const results: SearchResultItem[] = [];

    tasks.forEach(task => results.push({
      id: task.id,
      type: 'task',
      title: task.text,
      category: task.category as Category,
      date: task.dueDate,
      path: `/tasks#${task.id}`,
    }));
    goals.forEach(goal => results.push({
      id: goal.id,
      type: 'goal',
      title: goal.name,
      category: goal.category as Category,
      path: `/goals#${goal.id}`,
    }));
    notes.forEach(note => results.push({
      id: note.id,
      type: 'note',
      title: note.title || note.content.substring(0, 50) + (note.content.length > 50 ? '...' : ''),
      category: note.category as Category,
      date: note.lastEdited,
      contentPreview: note.content.substring(0, 100) + (note.content.length > 100 ? '...' : ''),
      path: `/notes#${note.id}`,
    }));
    events.forEach(event => results.push({
      id: event.id,
      type: 'event',
      title: event.title,
      category: event.category as Category,
      date: event.date,
      contentPreview: event.description?.substring(0, 100) + ((event.description?.length || 0) > 100 ? '...' : ''),
      path: `/calendar#${event.id}`,
    }));
    
    results.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA; 
    });

    return NextResponse.json(results.slice(0, 20), { status: 200 });

  } catch (error) {
    console.error('Failed to perform search:', error);
    return NextResponse.json({ message: 'Failed to perform search', error: (error as Error).message }, { status: 500 });
  }
}


```

## src/app/api/auth/register/route.ts

```
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel, { IUser } from '@/models/UserModel';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { id, email, name, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }
    if (password.length < 6) {
        return NextResponse.json({ message: 'Password must be at least 6 characters long.'}, { status: 400 });
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 }); // 409 Conflict
    }

    // The password will be hashed by the pre-save hook in UserModel
    const newUser: IUser = new UserModel({
      id: id || uuidv4(), // Use provided ID or generate new
      email: email.toLowerCase(),
      name: name || '',
      passwordHash: password, // Pass plain password, it will be hashed by Mongoose pre-save hook
    });

    await newUser.save();

    // Don't return the passwordHash
    const userResponse = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
    };

    return NextResponse.json(userResponse , { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    // Check for Mongoose validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
        return NextResponse.json({ message: 'Validation Error', errors: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred during registration.' }, { status: 500 });
  }
}

```

## src/app/api/auth/[...nextauth]/route.ts

```
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

```

## src/app/api/goals/route.ts

```
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GoalModel, { IGoal } from '@/models/GoalModel';
import { Goal } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  try {
    const query: any = { userId };
    if (category && category !== "All Projects") {
      query.category = category;
    }
    const goals: IGoal[] = await GoalModel.find(query).sort({ createdAt: -1 });
    return NextResponse.json(goals, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to fetch goals:', error);
    return NextResponse.json({ message: 'Failed to fetch goals', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  try {
    const body: Omit<Goal, 'id' | 'userId' | 'createdAt'> = await request.json();
     const newGoalData: Goal = {
        id: uuidv4(),
        userId: userId,
        name: body.name,
        currentValue: body.currentValue,
        targetValue: body.targetValue,
        unit: body.unit,
        category: body.category,
        // createdAt will be added by Mongoose timestamps
    };
    const goal: IGoal = new GoalModel(newGoalData);
    await goal.save();
    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error('Failed to create goal:', error);
    return NextResponse.json({ message: 'Failed to create goal', error: (error as Error).message }, { status: 500 });
  }
}


```

## src/app/api/goals/[id]/route.ts

```
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GoalModel from '@/models/GoalModel';
import { Goal } from '@/types';
import { getToken } from 'next-auth/jwt';

interface Params {
  id: string;
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userIdAuth = token.id as string;

  await dbConnect();
  const { id } = params;
  try {
    const body: Partial<Omit<Goal, 'id' | 'userId'>> = await request.json();
    const updatedGoal = await GoalModel.findOneAndUpdate({ id: id, userId: userIdAuth }, body, { new: true, runValidators: true });
    if (!updatedGoal) {
      return NextResponse.json({ message: 'Goal not found or you do not have permission to update it.' }, { status: 404 });
    }
    return NextResponse.json(updatedGoal, { status: 200 });
  } catch (error) {
    console.error(`Failed to update goal ${id}:`, error);
    return NextResponse.json({ message: `Failed to update goal ${id}`, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userIdAuth = token.id as string;

  await dbConnect();
  const { id } = params;
  try {
    const deletedGoal = await GoalModel.findOneAndDelete({ id: id, userId: userIdAuth });
    if (!deletedGoal) {
      return NextResponse.json({ message: 'Goal not found or you do not have permission to delete it.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Goal deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete goal ${id}:`, error);
    return NextResponse.json({ message: `Failed to delete goal ${id}`, error: (error as Error).message }, { status: 500 });
  }
}


```

## src/app/api/projects/route.ts

```
import { NextRequest, NextResponse } from 'next/server';
import { Category } from '@/types';

// For now, projects (categories) are hardcoded as per the initial setup.
// This API route can be expanded later if dynamic project/category management is needed.
// Currently, it will just return the predefined list.
const initialProjectsData: { id: string, name: Category }[] = [
    { id: 'proj_all', name: 'All Projects' }, // Added All Projects for completeness
    { id: 'proj_personal', name: 'Personal Life' },
    { id: 'proj_work', name: 'Work' },
    { id: 'proj_learning', name: 'Studies' }
];

export async function GET(request: NextRequest) {
  try {
    // In a real scenario, you might fetch these from a 'Categories' collection in MongoDB
    const categories: Category[] = initialProjectsData.map(p => p.name);
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch projects/categories:', error);
    return NextResponse.json({ message: 'Failed to fetch projects/categories', error: (error as Error).message }, { status: 500 });
  }
}

// POST might be used to add a new category dynamically if needed.
// For now, we'll assume categories are managed elsewhere or are static.
/*
export async function POST(request: NextRequest) {
  // Example: Add a new category to a 'Categories' collection
  // await dbConnect();
  // const { name } = await request.json();
  // const newCategory = new CategoryModel({ name });
  // await newCategory.save();
  // return NextResponse.json(newCategory, { status: 201 });
  return NextResponse.json({ message: 'Project creation not implemented yet' }, { status:501});
}
*/

```

## src/app/api/ai/route.ts

```
import { NextRequest, NextResponse } from 'next/server';
import { processWithGemini, GeminiProcessedResponse, AiOperation } from '@/lib/gemini';
import { Category, Task, Note, Goal, Event as AppEvent, SubTask } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '@/lib/mongodb';
import TaskModel from '@/models/TaskModel';
import NoteModel from '@/models/NoteModel';
import GoalModel from '@/models/GoalModel';
import EventModel from '@/models/EventModel';
import { getToken } from 'next-auth/jwt';

const baseAvailableCategories: Category[] = ["Personal Life", "Work", "Studies"];

async function findTaskByName(userId: string, taskName: string, category?: Category): Promise<Task | null> {
    const query: any = { userId, text: { $regex: `^${taskName}$`, $options: 'i' } }; // Case-insensitive exact match
    if (category && category !== "All Projects") {
        query.category = category;
    }
    return TaskModel.findOne(query).lean(); // .lean() for plain JS object
}


export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.id) {
    return NextResponse.json({ message: 'Unauthorized for AI command' }, { status: 401 });
  }
  const userId = token.id as string;

  await dbConnect();
  try {
    const { command, currentCategory } = await request.json();

    if (!command || typeof command !== 'string') {
      return NextResponse.json({ message: 'Command is required and must be a string.' }, { status: 400 });
    }
    if (!currentCategory || typeof currentCategory !== 'string') {
      return NextResponse.json({ message: 'currentCategory is required and must be a string.' }, { status: 400 });
    }

    const geminiResult: GeminiProcessedResponse = await processWithGemini(command, currentCategory as Category, ["All Projects", ...baseAvailableCategories]);

    if (geminiResult.overallError || geminiResult.operations.length === 0) {
      return NextResponse.json({ message: 'AI could not process the command.', details: geminiResult.overallError || "No operations returned from AI.", originalCommand: command }, { status: 422 });
    }

    let createdItemsInfo: { type: string; summary: string; success: boolean; error?: string }[] = [];
    let hasErrors = false;
    let aiMessageForCard: string | null = null;

    for (const operation of geminiResult.operations) {
      const payloadCategory = operation.payload.category;
      const effectiveCategory = (payloadCategory === "All Projects" && baseAvailableCategories.length > 0) 
                                ? baseAvailableCategories[0] 
                                : payloadCategory || currentCategory; 
      let itemSummary = "";

      try {
        switch (operation.action) {
          case 'addTask':
            if (!operation.payload.text) throw new Error('Task text is missing.');
            itemSummary = operation.payload.text.substring(0, 30);
            const newTaskData: Task = {
              id: uuidv4(),
              userId: userId,
              text: operation.payload.text!,
              completed: false,
              dueDate: operation.payload.dueDate as string | undefined,
              category: effectiveCategory as Category,
              recurrenceRule: operation.payload.recurrenceRule,
              subTasks: (operation.payload.subTasks || []).map(st => ({ id: uuidv4(), text: st.text, completed: false })),
              createdAt: new Date().toISOString(),
            };
            const createdTask = new TaskModel(newTaskData);
            await createdTask.save();
            createdItemsInfo.push({ type: 'Task', summary: itemSummary, success: true });
            break;
          
          case 'updateTask':
            let taskToUpdateId = operation.payload.taskIdToUpdate;
            let taskInstance = null;

            if (taskToUpdateId) {
                taskInstance = await TaskModel.findOne({ id: taskToUpdateId, userId: userId });
            } else if (operation.payload.text) { // AI provided task name instead of ID
                taskInstance = await findTaskByName(userId, operation.payload.text, effectiveCategory as Category);
                if (taskInstance) {
                    taskToUpdateId = taskInstance.id; // Found the ID
                }
            }

            if (!taskInstance) {
                throw new Error(`Task '${operation.payload.text || taskToUpdateId || 'Unknown'}' not found or you are not authorized.`);
            }
            
            itemSummary = taskInstance.text.substring(0, 30);
            let updated = false;

            if (operation.payload.subTasksToAdd && operation.payload.subTasksToAdd.length > 0) {
                const newSubTasksForExisting = operation.payload.subTasksToAdd.map(st => ({ id: uuidv4(), text: st.text, completed: false }));
                taskInstance.subTasks = [...(taskInstance.subTasks || []), ...newSubTasksForExisting];
                updated = true;
            }
            // Handle other direct updates to the task if AI provides them
            if (operation.payload.text && operation.payload.text !== taskInstance.text) { // only update if text is different and not just used for lookup
                taskInstance.text = operation.payload.text;
                updated = true;
            }
            if (operation.payload.dueDate !== undefined) {
                taskInstance.dueDate = operation.payload.dueDate;
                updated = true;
            }
            if (operation.payload.category !== undefined && operation.payload.category !== taskInstance.category) {
                taskInstance.category = operation.payload.category as Category;
                updated = true;
            }
            if (operation.payload.completed !== undefined && operation.payload.completed !== taskInstance.completed) {
                taskInstance.completed = operation.payload.completed;
                updated = true;
            }
            if (operation.payload.recurrenceRule !== undefined) {
                taskInstance.recurrenceRule = operation.payload.recurrenceRule;
                updated = true;
            }
            
            if (updated) {
                await taskInstance.save();
                createdItemsInfo.push({ type: 'Task Updated', summary: itemSummary, success: true });
            } else {
                 createdItemsInfo.push({ type: 'Task Update', summary: itemSummary, success: true, error: "No changes applied to task." });
            }
            break;

          case 'addNote':
            if (!operation.payload.content) throw new Error('Note content is missing.');
            itemSummary = operation.payload.title || operation.payload.content.substring(0, 30);
            const newNoteData: Note = {
              id: uuidv4(),
              userId: userId, 
              title: operation.payload.title as string | undefined,
              content: operation.payload.content!,
              category: effectiveCategory as Category,
              lastEdited: new Date().toISOString(),
            };
            const createdNote = new NoteModel(newNoteData);
            await createdNote.save();
            createdItemsInfo.push({ type: 'Note', summary: itemSummary, success: true });
            break;

          case 'addGoal':
            if (!operation.payload.name || operation.payload.targetValue === undefined || !operation.payload.unit) {
                throw new Error('Goal name, targetValue, or unit is missing.');
            }
            itemSummary = operation.payload.name.substring(0, 30);
            const newGoalData: Goal = {
              id: uuidv4(),
              userId: userId, 
              name: operation.payload.name!,
              currentValue: (operation.payload as Goal).currentValue || 0,
              targetValue: operation.payload.targetValue!,
              unit: operation.payload.unit!,
              category: effectiveCategory as Category,
            };
            const createdGoal = new GoalModel(newGoalData);
            await createdGoal.save();
            createdItemsInfo.push({ type: 'Goal', summary: itemSummary, success: true });
            break;
            
          case 'addEvent':
            if (!operation.payload.title || !operation.payload.date) {
                 throw new Error('Event title or date is missing.');
            }
            itemSummary = operation.payload.title.substring(0, 30);
            const newEventData: AppEvent = {
                id: uuidv4(),
                userId: userId, 
                title: operation.payload.title!,
                date: operation.payload.date!,
                description: operation.payload.description as string | undefined,
                category: effectiveCategory as Category,
                recurrenceRule: operation.payload.recurrenceRule,
            };
            const createdEvent = new EventModel(newEventData);
            await createdEvent.save();
            createdItemsInfo.push({ type: 'Event', summary: itemSummary, success: true });
            break;
          
          case 'clarification':
          case 'suggestion':
            if (operation.payload.message) {
              aiMessageForCard = operation.payload.message;
              if (geminiResult.operations.length === 1) { // If this is the *only* operation
                 createdItemsInfo.push({ type: operation.action, summary: operation.payload.message, success: true});
              }
            }
            break;

          case 'unknown':
            hasErrors = true;
            createdItemsInfo.push({ type: 'Unknown', summary: operation.payload.error || 'Could not process part of the command.', success: false, error: operation.payload.error });
            break;
          default:
            hasErrors = true;
            createdItemsInfo.push({ type: 'Unsupported', summary: `Action '${operation.action}' not supported.`, success: false, error: `Unsupported action: ${operation.action}`});
        }
      } catch (opError) {
        hasErrors = true;
        console.error(`Error during AI operation ${operation.action}:`, opError);
        createdItemsInfo.push({ type: operation.action, summary: itemSummary || 'Failed operation', success: false, error: (opError as Error).message });
      }
    }

    let responseMessage = "";
    if (createdItemsInfo.some(item => item.success && item.type !== 'clarification' && item.type !== 'suggestion')) {
        const successfulActions = createdItemsInfo.filter(item => item.success && item.type !== 'clarification' && item.type !== 'suggestion');
        responseMessage = successfulActions.map(s => `${s.type} "${s.summary}..." processed`).join('. ') + ". ";
    }
    
    if (aiMessageForCard) { // If there's a specific clarification/suggestion message from a dedicated operation
        responseMessage = aiMessageForCard; // This message takes precedence if it's the only "successful" thing
    }
    
    if (createdItemsInfo.some(item => !item.success)) {
        const failures = createdItemsInfo.filter(item => !item.success);
        responseMessage += (responseMessage ? " " : "") + "Some operations failed: " + failures.map(f => `${f.type} (${f.error || 'Unknown error'})`).join('. ') + ".";
        hasErrors = true; // Ensure hasErrors is true if any operation failed
    }
    
    if (responseMessage.trim() === "") {
        responseMessage = hasErrors ? "There were issues processing your command." : "Command received, but no specific actions were taken.";
    }

    return NextResponse.json({ 
        message: responseMessage.trim(), 
        details: createdItemsInfo, 
        originalCommand: command 
    }, { status: hasErrors && !createdItemsInfo.some(i=>i.success) ? 422 : 200 }); // 422 if all ops failed or only unknown/error ops

  } catch (error) {
    console.error('Error in AI command processing API:', error);
    return NextResponse.json({ message: 'Failed to process AI command.', error: (error as Error).message }, { status: 500 });
  }
}



```

## src/app/login/page.tsx

```typescript
"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AyandaLogoIcon } from '@/components/layout/AyandaLogoIcon';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (result?.error) {
      setError(result.error === "CredentialsSignin" ? "Invalid email or password." : result.error);
    } else if (result?.ok) {
      router.push('/'); // Redirect to dashboard or desired page
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background-color-val)] p-4">
       <Link href="/landing" className="flex items-center space-x-3 mb-8 cursor-pointer group">
        <AyandaLogoIcon className="group-hover:scale-110 transition-transform duration-200" />
        <h1 className="font-orbitron text-4xl font-bold tracking-wider accent-text group-hover:brightness-110 transition-all duration-200">AYANDA</h1>
      </Link>
      <Card className="w-full max-w-md bg-[var(--widget-background-val)] border-[var(--border-color-val)] shadow-2xl">
        <CardHeader className="items-center text-center">
          <CardTitle className="font-orbitron text-2xl accent-text">Welcome Back</CardTitle>
          <CardDescription className="text-[var(--text-muted-color-val)]">
            Sign in to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-color-val)]">Email Address</label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-[var(--text-color-val)]">Password</label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive text-center bg-destructive/10 p-2 rounded-md">{error}</p>
            )}
            <div>
              <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-center">
          <p className="text-sm text-[var(--text-muted-color-val)]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium accent-text hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

```

## src/lib/authOptions.ts

```
import { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import UserModel, { IUser } from '@/models/UserModel';
import { AuthenticatedUser } from '@/types'; // Import AuthenticatedUser
import { v4 as uuidv4 } from 'uuid';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password");
        }
        await dbConnect();
        const user = await UserModel.findOne({ email: credentials.email.toLowerCase() });

        if (!user) {
          throw new Error("No user found with this email.");
        }

        const isValidPassword = await user.comparePassword(credentials.password);
        if (!isValidPassword) {
          throw new Error("Incorrect password.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        } as AuthenticatedUser; // Cast to AuthenticatedUser
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as AuthenticatedUser; // Type assertion
        token.id = authUser.id;
        token.email = authUser.email;
        token.name = authUser.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        const sessionUser = session.user as AuthenticatedUser; // Type assertion
        sessionUser.id = token.id as string;
        sessionUser.email = token.email as string;
        sessionUser.name = token.name as string | undefined | null;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    // error: '/auth/error', // Optional: custom error page
  },
  secret: process.env.NEXTAUTH_SECRET,
};

```

## src/lib/fonts.ts

```
import { Inter, Orbitron, Manrope, Lexend, Poppins, JetBrains_Mono, Lora } from 'next/font/google';
import { GeistSans } from 'geist/font/sans'; // Vercel's Geist font

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const orbitronFont = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron-val",
  weight: ["500", "700"],
  display: 'swap',
});

export const geistSans = GeistSans; // Already configured with variable --font-geist-sans

export const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
});

export const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

export interface FontConfig {
  key: string;
  name: string;
  variableName: string; // The CSS variable name (e.g., "--font-inter")
  className: string; // The className from next/font if needed directly (e.g., inter.className)
  previewStyle?: React.CSSProperties;
}

export const availableFonts: FontConfig[] = [
  { key: 'inter', name: 'Inter (Default)', variableName: '--font-inter', className: inter.className, previewStyle: { fontFamily: 'var(--font-inter)'} },
  { key: 'geist-sans', name: 'Geist Sans', variableName: '--font-geist-sans', className: geistSans.variable, previewStyle: { fontFamily: 'var(--font-geist-sans)'} },
  { key: 'orbitron', name: 'Orbitron', variableName: '--font-orbitron-val', className: orbitronFont.className, previewStyle: { fontFamily: 'var(--font-orbitron-val)'} },
  { key: 'manrope', name: 'Manrope', variableName: '--font-manrope', className: manrope.className, previewStyle: { fontFamily: 'var(--font-manrope)'} },
  { key: 'lexend', name: 'Lexend', variableName: '--font-lexend', className: lexend.className, previewStyle: { fontFamily: 'var(--font-lexend)'} },
  { key: 'poppins', name: 'Poppins', variableName: '--font-poppins', className: poppins.className, previewStyle: { fontFamily: 'var(--font-poppins)'} },
  { key: 'jetbrains-mono', name: 'JetBrains Mono', variableName: '--font-jetbrains-mono', className: jetbrainsMono.className, previewStyle: { fontFamily: 'var(--font-jetbrains-mono)'} },
  { key: 'lora', name: 'Lora', variableName: '--font-lora', className: lora.className, previewStyle: { fontFamily: 'var(--font-lora)'} },
];

export const defaultFontKey = 'inter';

```

## src/lib/gemini.ts

```
import {
  GoogleGenerativeAI, // Correct class name
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai"; // Correct package name

import { Category, Task, Goal, Note, Event as AppEvent, RecurrenceRule, SubTask } from '@/types';
import { format, addDays, parseISO, isValid } from 'date-fns';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Please define the GEMINI_API_KEY environment variable inside .env.local');
}

// Use the new SDK initialization - API key is passed directly
const genAI = new GoogleGenerativeAI(API_KEY);

// Define generationConfig and safetySettings objects
// These were missing in the original code snippet
const generationConfig = {
  temperature: 0.7, // Example value
  topP: 0.95,       // Example value
  topK: 60,         // Example value
  maxOutputTokens: 1024, // Example value
  responseMimeType: "application/json", // Ensure JSON output
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE, // Example threshold
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE, // Example threshold
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE, // Example threshold
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE, // Example threshold
  },
];


function getTodaysDate() { return format(new Date(), 'yyyy-MM-dd'); }
function getTomorrowsDate() { return format(addDays(new Date(), 1), 'yyyy-MM-dd'); }

export interface AiOperation {
  action: "addTask" | "addNote" | "addGoal" | "addEvent" | "updateTask" | "unknown" | "clarification" | "suggestion";
  payload: Partial<Task & Note & Goal & AppEvent & {
    taskIdToUpdate?: string; // For updateTask action
    text?: string; name?: string; title?: string; content?: string; // Basic fields
    targetValue?: number; unit?: string; // Goal specific
    date?: string; description?: string; // Event specific
    dueDate?: string; // Task specific
    category?: Category;
    message?: string; // For clarification/suggestion
    recurrenceRule?: RecurrenceRule;
    subTasks?: { text: string }[]; // For creating tasks with subtasks
    subTasksToAdd?: { text: string }[]; // For adding subtasks to an existing task
    subTasksToRemove?: string[]; // IDs of subtasks to remove
    subTasksToUpdate?: { id: string; text?: string; completed?: boolean }[]; // For updating existing subtasks
  }>;
  error?: string; // Error is at the top level of AiOperation
}

export interface GeminiProcessedResponse {
  operations: AiOperation[];
  originalCommand: string;
  overallError?: string;
}

export async function processWithGemini(
    command: string,
    currentCategory: Category,
    availableCategories: Category[]
): Promise<GeminiProcessedResponse> {
  // Log the user command
  console.log("User Command:", command);

  const today = getTodaysDate();
  const tomorrow = getTomorrowsDate();

  // The core persona and instruction for JSON output format become the system instruction
  // This should be a single string in the latest SDK
  const systemInstruction = `You MUST ONLY return a JSON object with a top-level field named "operations". This field MUST be an ARRAY of objects. Each object in the array represents a distinct action to be taken.

You are AYANDA, an AI assistant. Your primary goal is to accurately convert the user's specific command into this structured JSON object format.
Today's date is ${today}. Tomorrow's date is ${tomorrow}.

Each operation object MUST have "action" and "payload" fields.
"action" can be: "addTask", "addNote", "addGoal", "addEvent", "updateTask", "clarification", "suggestion", or "unknown".
"payload" contains details for that action. Your interpretation MUST be based on the user's command.

DO NOT return any other JSON structure or conversational text outside of the "operations" array JSON.
DO NOT attempt to interpret the user's command as an external action or tool call (e.g., do not return JSON for finding an object, setting a timer, etc.).
If a command does not fit one of the defined actions ("addTask", "addNote", "addGoal", "addEvent", "updateTask", "clarification", "suggestion"), you MUST use the "unknown" action and provide a message or error in the payload. This is the ONLY acceptable output for unclear commands.

Available categories for items are: ${availableCategories.join(", ")}.
If the user specifies a category, use it. If not, and the command implies a category, try to infer it.
If no category is specified or can be reasonably inferred for an item, use the current category: "${currentCategory}". If currentCategory is "All Projects", try to pick a more specific one from the available list for that item, or use the first available specific category if unsure (e.g., "Personal Life").

Field details for "payload" based on "action":
- "addTask":
  - "text": (string, required) Task description.
  - "dueDate": (string, optional,-MM-DD format) Infer date. This is the start date for recurring tasks.
  - "category": (string, required) Category.
  - "subTasks": (array of objects, optional) For creating subtasks with a NEW task. Each object: { "text": "subtask description" }.
  - "recurrenceRule": (object, optional) With "type" ('daily', 'weekly', 'monthly', 'yearly'), "interval" (number), and optional "daysOfWeek" (array of numbers 0-6 for weekly), "dayOfMonth" (number for monthly), "endDate" (YYYY-MM-DD), "count" (number).
- "addNote":
  - "title": (string, optional) Note title.
  - "content": (string, required) Note content. Can include Markdown.
  - "category": (string, required) Category.
- "addGoal":
  - "name": (string, required) Goal name.
  - "targetValue": (number, required) Target.
  - "unit": (string, required) Unit.
  - "currentValue": (number, defaults to 0) Current progress.
  - "category": (string, required) Category.
- "addEvent":
  - "title": (string, required) Event title.
  - "date": (string, required, ISO 8601 format:-MM-DDTHH:mm:ss.sssZ or-MM-DDTHH:mm) Event start date & time. Default time to 12:00 PM if only date given. This is the start for recurring events.
  - "description": (string, optional) Description.
  - "category": (string, required) Category.
  - "recurrenceRule": (object, optional) Same structure as for tasks.
- "updateTask":
  - "taskIdToUpdate": (string, optional) ID of the task if known or clearly implied by the user's command (e.g., "update task ID 123"). If the user refers to a task by name (e.g., "add subtask to 'Project X'"), you can set the "text" field to "Project X" and OMIT "taskIdToUpdate". The system will try to find it.
  - "text": (string, optional) New task description or the name of the task to find if taskIdToUpdate is not known.
  - "dueDate": (string, optional,-MM-DD format) New due date.
  - "category": (string, optional) New category.
  - "completed": (boolean, optional) New completion status.
  - "subTasksToAdd": (array of objects, optional) For ADDING subtasks to an EXISTING task. Each object: { "text": "subtask description" }.
  - "recurrenceRule": (object, optional) New or updated recurrence rule.
- "clarification" or "suggestion":
  - "message": (string, required) Message to display.
- "unknown":
  - "error": (string, optional) Brief explanation.
  - "message": (string, optional) General message.

Infer recurrence from phrases like "every day", "weekly on Tuesdays", "monthly on the 15th", "every 2 weeks".
For weekly recurrence, "daysOfWeek" should be an array of numbers (Sunday=0, Monday=1, ..., Saturday=6).

Example 1 (New task with subtasks): User says "Create a task to organize my study notes with subtasks: review lecture 1, summarize chapter 2, create flashcards for key terms."
JSON Output:
{
  "operations": [
    {
      "action": "addTask",
      "payload": {
        "text": "Organize my study notes",
        "category": "Studies",
        "subTasks": [
          { "text": "review lecture 1" },
          { "text": "summarize chapter 2" },
          { "text": "create flashcards for key terms" }
        ]
      }
    }
  ]
}

Example 2 (Add subtasks to an existing task named 'Client Presentation'): User says "Add subtasks to 'Client Presentation': final run-through and check equipment."
JSON Output:
{
  "operations": [
    {
      "action": "updateTask",
      "payload": {
        "text": "Client Presentation", // Task name to find
        "subTasksToAdd": [
          { "text": "final run-through" },
          { "text": "check equipment" }
        ]
      }
    }
  ]
}

Example 3 (Simple task): User says "remind me to call John tomorrow at 2 PM about the project"
JSON Output:
{
    "operations": [
        {
            "action": "addEvent",
            "payload": {
                "title": "Call John about the project",
                "date": "${tomorrow}T14:00:00.000Z",
                "category": "${currentCategory === "All Projects" ? "Personal Life" : currentCategory}"
            }
        }
    ]
}

If the command is very unclear or does not fit any of the defined actions, you MUST return: { "operations": [ { "action": "unknown", "payload": { "message": "I couldn't understand how to convert that command into a task, note, goal, or event. Can you please rephrase?" } } ] }.
`; // System instruction as a single string


  // The user-specific part of the prompt
  const userContent = `User Command: "${command}"\nJSON Output:\n `;


  try {
    // Get the generative model instance
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", // Changed model to 2.0-flash
      systemInstruction: systemInstruction, // Pass system instruction directly
    });

    // Generate content, passing config and safety settings directly
    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: userContent }] }], // User content here
        generationConfig: generationConfig, // Pass generationConfig directly
        safetySettings: safetySettings, // Pass safetySettings directly
    });

    // Access text using result.response.text()
    let responseText = result.response.text();

    // Log the raw AI response text
    console.log("Raw AI Response Text:", responseText);

    // Ensure responseText is a string before processing
    if (typeof responseText !== 'string') {
        console.error(`Expected string response, but got: ${typeof responseText}`);
        return {
            operations: [{ action: "unknown", payload: { error: "AI response format error: Did not receive a string response.", message: String(responseText) } }],
            originalCommand: command,
            overallError: "AI response format error: Did not receive a string response."
        };
    }

    // Attempt to extract JSON from a markdown code block if present
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
        responseText = jsonMatch[1];
    } else {
        // If not wrapped, trim whitespace just in case
        responseText = responseText.trim();
    }

    // Added a check to see if the response starts with '{' to quickly identify non-JSON issues
    if (!responseText.startsWith('{')) {
       console.error(`Expected JSON response (starting with '{'), but got: ${responseText.substring(0, 200)}...`);
       // If it doesn't look like JSON at all, return an unknown operation
       return {
           operations: [{ action: "unknown", payload: { error: "AI response format error: Did not receive a JSON object.", message: responseText } }],
           originalCommand: command,
           overallError: "AI response format error: Did not receive a JSON object."
       };
    }

    let parsedJson = JSON.parse(responseText);

    if (!parsedJson.operations || !Array.isArray(parsedJson.operations)) {
        console.warn("Gemini did not return operations as an array. Response:", responseText);
        // If the structure is wrong, force it into the expected format with an 'unknown' action
        parsedJson = { operations: [ { action: "unknown", payload: { error: "AI response format error: Expected 'operations' array.", message: responseText } } ] };
    }

    const processedOperations: AiOperation[] = parsedJson.operations.map((op: any) => {
        let { action, payload } = op;
        if (!payload) payload = {};

        // Post-process category: Ensure a specific category is assigned if "All Projects" was the context
        if ((payload.category === "All Projects" || !payload.category) &&
            action !== 'clarification' && action !== 'suggestion' && action !== 'unknown') {

            if (currentCategory !== "All Projects" && availableCategories.includes(currentCategory)) {
                payload.category = currentCategory;
            } else {
                // If currentCategory is "All Projects" or not in available, pick first specific one
                const firstSpecificCategory = availableCategories.find(cat => cat !== "All Projects");
                payload.category = firstSpecificCategory || (availableCategories.length > 0 && availableCategories[0] !== "All Projects" ? availableCategories[0] : "Personal Life"); // Final fallback
            }
        }

        // Validate/format dates
        if ((action === "addTask" || action === "updateTask") && payload.dueDate) {
            try {
                const parsedDate = parseISO(payload.dueDate as string);
                payload.dueDate = isValid(parsedDate) ? format(parsedDate, 'yyyy-MM-dd') : undefined;
            } catch (e) { payload.dueDate = undefined; }
        }
        if (action === "addEvent" && payload.date) {
            try {
                // Attempt to parse, allowing for-MM-DD or full ISO
                let parsedEventDate = parseISO(payload.date as string);
                if (!isValid(parsedEventDate) && (payload.date as string).match(/^\d{4}-\d{2}-\d{2}$/)) {
                    // If it's just a date, append a default time (e.g., noon) before parsing
                    parsedEventDate = parseISO(`${payload.date}T12:00:00.000Z`);
                }
                payload.date = isValid(parsedEventDate) ? parsedEventDate.toISOString() : undefined;
            } catch (e) { payload.date = undefined; }
        }
        // Validate recurrenceRule dates
        if (payload.recurrenceRule?.endDate) {
            try {
                const parsedEndDate = parseISO(payload.recurrenceRule.endDate as string);
                payload.recurrenceRule.endDate = isValid(parsedEndDate) ? format(parsedEndDate, 'yyyy-MM-dd') : undefined;
            } catch (e) { if (payload.recurrenceRule) payload.recurrenceRule.endDate = undefined; }
        }

        // Return the AiOperation object with error at the top level
        // Ensure error is only included if it exists in the original op object
        const operation: AiOperation = { action, payload };
        if (op.error !== undefined) {
            operation.error = op.error;
        }
        return operation;
    });

    return { operations: processedOperations, originalCommand: command };

  } catch (error) {
    console.error("Error processing with Gemini:", error);
    const errorMessage = `Gemini API error or JSON parsing issue: ${(error as Error).message}`;
    return {
      operations: [{ action: "unknown", payload: { error: errorMessage } }], // Error at the top level
      originalCommand: command,
      overallError: errorMessage
    };
  }
}

```

## src/lib/mongodb.ts

```
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;

```

## src/lib/themes.ts

```
export interface ColorSet {
  // Base AYANDA variables (source of truth)
  accentColorVal: string;
  accentColorHsl: string; 
  primaryForegroundVal: string; // Text color for on primary/accent backgrounds
  backgroundColorVal: string;
  widgetBackgroundVal: string; // For cards, popovers, distinct element backgrounds
  textColorVal: string;
  textMutedColorVal: string;
  borderColorVal: string;
  inputBgVal: string;
  dangerColorVal: string;

  // Pre-resolved shadcn variable values for direct setting by ThemeProvider
  // This avoids relying on CSS alias interpretation if there are issues.
  // These will be set directly on :root by JS.
  '--background': string;
  '--foreground': string;
  '--card': string;
  '--card-foreground': string;
  '--popover': string;
  '--popover-foreground': string;
  '--primary': string;
  '--primary-foreground': string;
  '--secondary': string;
  '--secondary-foreground': string;
  '--muted': string;
  '--muted-foreground': string;
  '--accent': string; 
  '--accent-foreground': string;
  '--destructive': string;
  '--destructive-foreground': string;
  '--border': string;
  '--input': string; 
  '--ring': string;  
}

export interface Theme {
  key: string;
  displayName: string;
  previewColor: string; 
  light: ColorSet;
  dark: ColorSet;
}

const toHslString = (hue: number, saturation: number, lightness: number) => `${hue} ${saturation}% ${lightness}%`;

function createThemeColors(
    isDark: boolean,
    // AYANDA source values
    accentHex: string, 
    accentHslParts: [number, number, number], 
    primaryFgHex: string, // Explicit foreground for primary
    backgroundHex: string,
    widgetBgHex: string, // This is for cards, popovers etc.
    textHex: string,
    textMutedHex: string,
    borderHex: string,
    inputBgHex: string,
    dangerHex: string = '#FF4757'
): ColorSet {
    const accentHslStr = toHslString(...accentHslParts);

    return {
        // AYANDA source variables
        accentColorVal: accentHex,
        accentColorHsl: accentHslStr,
        primaryForegroundVal: primaryFgHex,
        backgroundColorVal: backgroundHex,
        widgetBackgroundVal: widgetBgHex, // This is the important one for popovers/cards
        textColorVal: textHex,
        textMutedColorVal: textMutedHex,
        borderColorVal: borderHex,
        inputBgVal: inputBgHex,
        dangerColorVal: dangerHex,

        // Directly resolved shadcn variables
        '--background': backgroundHex,
        '--foreground': textHex,
        '--card': widgetBgHex, // Card uses widgetBgHex
        '--card-foreground': textHex,
        '--popover': widgetBgHex, // Popover uses widgetBgHex
        '--popover-foreground': textHex,
        '--primary': accentHex,
        '--primary-foreground': primaryFgHex,
        '--secondary': inputBgHex, 
        '--secondary-foreground': textHex,
        '--muted': inputBgHex, 
        '--muted-foreground': textMutedHex,
        '--accent': `hsl(${accentHslStr} / 0.1)`,
        '--accent-foreground': accentHex,
        '--destructive': dangerHex,
        '--destructive-foreground': textHex, 
        '--border': borderHex,
        '--input': borderHex, 
        '--ring': `hsl(${accentHslStr} / 0.5)`,
    };
}

export const themes: Theme[] = [
  {
    key: 'default-cyan',
    displayName: 'Default Cyan',
    previewColor: '#00DCFF',
    light: createThemeColors(
        false,    // isDark
        '#00A0B8',// accentHex (Primary buttons)
        [188, 100, 36], // accentHslParts
        '#FFFFFF',// primaryFgHex (Text on primary buttons)
        '#F0F4F8',// backgroundHex (Page background)
        '#FFFFFF',// widgetBgHex (Cards, Popovers background)
        '#101820',// textHex
        '#505A6A',// textMutedHex
        '#DDE2E8',// borderHex
        '#E8ECF1',// inputBgHex
        '#E53E3E' // dangerHex
    ),
    dark: createThemeColors(
        true,     // isDark
        '#00DCFF',// accentHex
        [190, 100, 50], // accentHslParts
        '#0A0F14',// primaryFgHex
        '#0A0F14',// backgroundHex
        '#101820',// widgetBgHex
        '#E0E7FF',// textHex
        '#707A8A',// textMutedHex
        'rgba(0, 220, 255, 0.15)',// borderHex (increased opacity slightly)
        'rgba(255, 255, 255, 0.03)',// inputBgHex
        '#FF4757' // dangerHex
    ),
  },
  {
    key: 'sakura-pink',
    displayName: 'Sakura Pink',
    previewColor: '#FFB6C1',
    light: createThemeColors(
        false, '#F472B6', [330, 87, 70], '#FFFFFF',
        '#FFF0F5', '#FFFFFF', '#522236', '#A47086',
        '#FFD9E1', '#FFE5EA', '#E53E3E'
    ),
    dark: createThemeColors(
        true, '#FFB6C1', [351, 100, 85], '#1A1114',
        '#1A1114', '#2A1A20', '#FFE0E5', '#B88091',
        'rgba(255, 182, 193, 0.2)', '#rgba(255, 182, 193, 0.07)', '#FF6B81'
    ),
  },
  {
    key: 'forest-green',
    displayName: 'Forest Green',
    previewColor: '#2F855A', 
    light: createThemeColors(
        false, '#2F855A', [147, 46, 35], '#FFFFFF',
        '#F0FFF4', '#FFFFFF', '#1A4731', '#5A806B',
        '#C6F6D5', '#E6FFFA', '#E53E3E'
    ),
    dark: createThemeColors(
        true, '#68D391', [145, 50, 61], '#0E1A14',
        '#0E1A14', '#14251C', '#D8FEE6', '#609077',
        'rgba(104, 211, 145, 0.2)', 'rgba(104, 211, 145, 0.07)', '#FF7878'
    ),
  },
  {
    key: 'solar-yellow',
    displayName: 'Solar Yellow',
    previewColor: '#F6E05E', 
    light: createThemeColors( // Solar Yellow Light with distinct widget/popover background
        false,    // isDark
        '#D69E2E',// accentHex (Darker Gold for buttons)
        [39, 68, 51], // accentHslParts
        '#3D2B00',// primaryFgHex (Dark text on accent buttons)
        '#FFFBEB',// backgroundHex (Page background - Cornsilk)
        '#FFFFFF',// widgetBgHex (Popover/Card background - White)
        '#3D2B00',// textHex (Main text - Dark Brown)
        '#785A0C',// textMutedHex
        '#FDE68A',// borderHex (Softer gold border, was FCE9A0)
        '#FEF3C7',// inputBgHex (Light yellow, was FFF5D1)
        '#E53E3E' // dangerHex
    ),
    dark: createThemeColors(
        true, '#F6E05E', [50, 90, 67], '#1A160A',
        '#1A160A', '#2A220F', '#FFFACD', '#C0A549',
        'rgba(246, 224, 94, 0.2)', 'rgba(246, 224, 94, 0.07)', '#FF8C8C'
    ),
  },
];

export const defaultThemeKey = 'default-cyan';
```

## src/lib/utils.ts

```
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

```

## .idx/dev.nix

```
# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{pkgs}: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.yarn
    pkgs.nodePackages.pnpm
    pkgs.bun
    pkgs.python311
  ];
  # Sets environment variables in the workspace
  env = {};
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
    ];
    workspace = {
      # Runs when a workspace is first created with this `dev.nix` file
      onCreate = {
        npm-install = "npm ci --no-audit --prefer-offline --no-progress --timing";
        # Open editors for the following files by default, if they exist:
        default.openFiles = [
          # Cover all the variations of language, src-dir, router (app/pages)
          "pages/index.tsx" "pages/index.js"
          "src/pages/index.tsx" "src/pages/index.js"
          "app/page.tsx" "app/page.js"
          "src/app/page.tsx" "src/app/page.js"
        ];
      };
      # To run something each time the workspace is (re)started, use the `onStart` hook
    };
    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}
```

