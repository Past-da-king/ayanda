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
    "@radix-ui/react-checkbox": "^1.3.1",
    "@radix-ui/react-dropdown-menu": "^2.1.14",
    "@radix-ui/react-progress": "^1.1.6",
    "@radix-ui/react-select": "^2.2.4",
    "@radix-ui/react-slot": "^1.2.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "geist": "^1.4.2",
    "lucide-react": "^0.511.0",
    "next": "15.3.2",
    "react": "^19.0.0",
    "react-day-picker": "^8.10.1",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^3.3.0",
    "uuid": "^11.1.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
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

import React, { useState, useEffect } from 'react';
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { Calendar } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';
import { Event as AppEvent } from '@/types';

interface CalendarWidgetProps {
  events: AppEvent[];
  onNavigate: () => void;
}

const DayCell = ({ date, events, dayHasEvents }: { date: Date; events: AppEvent[]; dayHasEvents: (currentDate: Date, allEvents: AppEvent[]) => boolean }) => {
  const displayDate = date.getDate();
  const showDot = dayHasEvents(date, events);
  return (
    <>
      {displayDate}
      {showDot ? <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[var(--accent-color-val)]/80 rounded-full" /> : null}
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

  const dayHasEvents = (currentDate: Date, allEvents: AppEvent[]): boolean => {
    if (!currentDate || !Array.isArray(allEvents)) return false;
    return allEvents.some(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === currentDate.getFullYear() &&
             eventDate.getMonth() === currentDate.getMonth() &&
             eventDate.getDate() === currentDate.getDate();
    });
  };

  return (
    <DashboardCardWrapper 
        title={currentMonthForTitle}
        onNavigate={onNavigate} 
        id="calendar-widget-summary"
        className="min-h-[280px] lg:min-h-[300px] flex flex-col"
        contentClassName="!p-2 flex flex-col flex-grow items-center justify-center" // This p-2 provides padding for the title and the calendar container
    >
      <Calendar
        mode="single"
        selected={selectedDay}
        onSelect={setSelectedDay}
        month={selectedDay || new Date()}
        className="p-0 w-full" // Removed max-w-[260px], calendar will fill its container within the p-2 wrapper
        classNames={{
          months: "flex flex-col items-center",
          month: "space-y-2 w-full", // Removed px-1, month div takes full width
          caption: "flex justify-center pt-0.5 relative items-center text-sm mb-1",
          caption_label: "text-sm font-medium accent-text sr-only", // Title is handled by DashboardCardWrapper
          nav: "space-x-1",
          nav_button: "h-6 w-6 p-0 opacity-0 cursor-default",
          
          table: "w-full border-collapse", // Table takes full width of month div
          head_row: "flex w-full", // Row takes full width, removed justify-around
          head_cell: cn(
            "text-[var(--text-muted-color-val)] rounded-md",
            "flex items-center justify-center font-normal text-[0.75rem] p-0",
            "h-7 flex-1 basis-0" // Each head cell takes 1/7th of the width
          ),
          row: "flex w-full mt-1", // Row takes full width, removed justify-around
          cell: cn(
            "text-center p-0 relative focus-within:relative focus-within:z-20 rounded-md",
            "flex flex-col items-center justify-center",
            "h-9 flex-1 basis-0" // Each day cell takes 1/7th of the width
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
  className?: string;
  contentClassName?: string;
  onNavigate?: () => void; // Renamed from onMoreOptions / onClick for clarity
  // onExpand?: () => void; // if onNavigate is used for card click, this could be specific to expand icon
  id?: string; // For targeting specific widgets if needed
  allowExpand?: boolean; // To control if expand icon is shown
}

export function DashboardCardWrapper({ 
  title, 
  children, 
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
    e.stopPropagation(); // Prevent card click if icon is clicked
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div 
      id={id}
      className={cn(
        "bg-[var(--widget-background-val)] border border-[var(--border-color-val)]",
        "shadow-[0_4px_15px_rgba(0,0,0,0.2)] rounded-[0.75rem]", // border-radius from target
        "flex flex-col",
        "transition-transform duration-200 ease-out hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(0,220,255,0.07)]", // hover effects
        onNavigate && allowExpand === false ? "cursor-pointer" : "", // Only make card itself clickable if no expand icon, or if expand icon does same
        className
      )}
      onClick={onNavigate && allowExpand === false ? handleCardClick : undefined} // Click on card only if not using expand icon for nav
    >
      {/* Widget Header */}
      <div className={cn(
        "border-b border-[var(--border-color-val)]",
        "px-4 py-3", // padding 0.75rem 1rem
        "mb-3", // margin-bottom 0.75rem
        "flex justify-between items-center"
      )}>
        <h2 className="font-orbitron text-lg accent-text">{title}</h2>
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

      {/* Widget Content Summary */}
      <div className={cn(
        "flex-grow overflow-y-auto", // flex-grow for filling space
        "px-4 pb-3", // padding 0 1rem 0.75rem 1rem
        "widget-content-summary-scrollbars", // For custom scrollbar styling if needed beyond global
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
import { Task, Event as AppEvent } from '@/types'; // Now Event should be found
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { cn } from '@/lib/utils';

interface DueSoonWidgetProps {
  tasks?: Task[]; // Mark as optional or ensure it's always an array
  events?: AppEvent[]; // Mark as optional or ensure it's always an array
  currentProjectId: string | null;
}

export function DueSoonWidget({ tasks = [], events = [], currentProjectId }: DueSoonWidgetProps) { // Default to empty arrays
  const upcomingItems: { type: string; name: string; date: Date; id: string; isToday: boolean; isTomorrow: boolean }[] = [];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const endOfThreeDays = new Date(today); endOfThreeDays.setDate(today.getDate() + 3);

  // Check if tasks is actually an array before calling .filter
  if (Array.isArray(tasks)) {
    tasks
      .filter(t => !t.completed && (currentProjectId === null || t.category === currentProjectId) && t.dueDate)
      .forEach(t => {
        // Ensure t.dueDate is not undefined/null before trying to use it
        if (t.dueDate) {
          const dueDate = new Date(t.dueDate + "T00:00:00Z"); // Added Z for UTC to be safe with date parsing
          if (!isNaN(dueDate.getTime()) && dueDate >= today && dueDate < endOfThreeDays) { // Check if date is valid
            upcomingItems.push({
              type: 'Task',
              name: t.text,
              date: dueDate,
              id: t.id,
              isToday: dueDate.getTime() === today.getTime(),
              isTomorrow: dueDate.getTime() === tomorrow.getTime(),
            });
          }
        }
      });
  }

  // Check if events is actually an array before calling .filter
  if (Array.isArray(events)) {
    events
      .filter(e => (currentProjectId === null || e.category === currentProjectId) && e.date) // Check e.date exists
      .forEach(e => {
        if (e.date) { // Double check e.date
          const eventDate = new Date(e.date); // Assuming e.date is a valid ISO string
          if (!isNaN(eventDate.getTime())) { // Check if date is valid
            const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()); // Compare date part only
            if (eventDateOnly >= today && eventDateOnly < endOfThreeDays) {
              upcomingItems.push({
                type: 'Event',
                name: e.title, // Using title as per defined Event type
                date: eventDateOnly,
                id: e.id,
                isToday: eventDateOnly.getTime() === today.getTime(),
                isTomorrow: eventDateOnly.getTime() === tomorrow.getTime(),
              });
            }
          }
        }
      });
  }

  upcomingItems.sort((a, b) => a.date.getTime() - b.date.getTime());
  const displayedItems = upcomingItems.slice(0, 4);

  return (
    <DashboardCardWrapper 
        title="DUE SOON" 
        allowExpand={false}
        className="lg:col-span-2"
        id="due-soon-widget-summary"
        contentClassName="space-y-2"
    >
      {displayedItems.length > 0 ? (
        <ul className="space-y-2">
          {displayedItems.map(item => {
            let dateString = item.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            if (item.isToday) dateString = "Today";
            else if (item.isTomorrow) dateString = "Tomorrow";
            
            return (
              <li 
                key={item.id} 
                className={cn(
                  "widget-item",
                  item.isToday ? "bg-amber-500/10 !border-l-amber-400" : "!border-l-sky-400/50"
                )}
              >
                <p className="text-sm truncate" title={item.name}>{item.type}: {item.name}</p>
                <p className="text-xs text-[var(--text-muted-color-val)]">{dateString}</p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-[var(--text-muted-color-val)] p-2">Nothing due soon.</p>
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
import React from 'react';
import { Task } from '@/types';
import { DashboardCardWrapper } from './DashboardCardWrapper';
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from '@/lib/utils';

interface TasksWidgetProps {
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
  onNavigate: () => void;
}

export function TasksWidget({ tasks, onTaskToggle, onNavigate }: TasksWidgetProps) {
  const displayedTasks = tasks.filter(t => !t.completed).slice(0, 7); // Show more tasks if it's taller

  return (
    <DashboardCardWrapper 
        title="TASKS" 
        onNavigate={onNavigate} 
        // Approximate height for 2 rows: (Widget height (300px) * 2) + gap (20px) = ~620px
        // Or use a relative unit that works with the grid's row definition
        className="min-h-[calc(var(--widget-base-height,300px)*2+var(--grid-gap,1.25rem))] flex flex-col" // Target height
        id="tasks-widget-summary"
        contentClassName="space-y-2 flex-grow" // flex-grow to use available space
    >
      {displayedTasks.length > 0 ? (
        <ul className="space-y-2">
          {displayedTasks.map((task) => (
            <li 
              key={task.id} 
              className={cn(
                "widget-item",
                "flex justify-between items-center"
              )}
            >
              <span 
                className="mr-2 overflow-hidden text-ellipsis whitespace-nowrap flex-grow" 
                title={task.text}
              >
                {task.text}
              </span>
              <Checkbox
                id={`task-widget-${task.id}`}
                checked={task.completed}
                onCheckedChange={() => onTaskToggle(task.id)}
                className={cn(
                  "form-checkbox h-4 w-4 shrink-0",
                  "border-[var(--text-muted-color-val)] rounded",
                  "focus:ring-offset-0 focus:ring-1 focus:ring-[var(--accent-color-val)]",
                  "data-[state=checked]:bg-[var(--accent-color-val)] data-[state=checked]:border-[var(--accent-color-val)] data-[state=checked]:text-[var(--background-color-val)]"
                )}
                aria-label={`Mark task ${task.text} as ${task.completed ? 'incomplete' : 'complete'}`}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--text-muted-color-val)] p-2">No active tasks.</p>
      )}
    </DashboardCardWrapper>
  );
}

```

## src/components/views/CalendarFullScreenView.tsx

```typescript
"use client"; 

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar } from "@/components/ui/calendar"; // This should import your shadcn/ui calendar
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Event as AppEvent, Category } from '@/types';
import { cn } from '@/lib/utils';
import { X, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { DateFormatter } from 'react-day-picker';

interface CalendarFullScreenViewProps {
  events: AppEvent[];
  categories: Category[];
  currentCategory: Category;
  onAddEvent: (title: string, date: string, category: Category, description?: string) => void;
  onUpdateEvent: (eventId: string, title: string, date: string, category: Category, description?: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onClose: () => void;
}

interface EventFormData {
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  category: Category;
  description?: string;
}

export function CalendarFullScreenView({
  events,
  categories,
  currentCategory,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onClose
}: CalendarFullScreenViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMonth, setViewMonth] = useState<Date>(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    category: currentCategory,
    description: ''
  });

  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: selectedDate.toISOString().split('T')[0],
        category: currentCategory === "All Projects" && categories.length > 0 ? categories[0] : currentCategory
      }));
    }
  }, [selectedDate, currentCategory, categories]);

  useEffect(() => {
    if (editingEvent) {
      const eventDate = new Date(editingEvent.date);
      setFormData({
        title: editingEvent.title,
        date: eventDate.toISOString().split('T')[0],
        time: eventDate.toTimeString().substring(0, 5),
        category: editingEvent.category,
        description: editingEvent.description || ''
      });
      setShowEventForm(true);
    }
  }, [editingEvent]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value as Category }));
  };

  const handleSubmitEvent = () => {
    if (!formData.title || !formData.date || !formData.time) return;
    const dateTimeString = `${formData.date}T${formData.time}:00.000Z`; 
    
    if (editingEvent) {
      onUpdateEvent(editingEvent.id, formData.title, dateTimeString, formData.category, formData.description);
    } else {
      onAddEvent(formData.title, dateTimeString, formData.category, formData.description);
    }
    resetForm();
  };

  const resetForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      time: '12:00',
      category: currentCategory === "All Projects" && categories.length > 0 ? categories[0] : currentCategory,
      description: ''
    });
  };

  const openEditForm = (event: AppEvent) => {
    setEditingEvent(event);
  };
  
  const dayHasEvents = useCallback((date: Date, allEvents: AppEvent[]): boolean => {
    if (!date) return false;
    return allEvents.some(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === date.getFullYear() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getDate() === date.getDate();
    });
  }, []);

  // DayCellContent now renders directly into the day cell
  // The `day` className on the Calendar component will handle the base styling of the cell
  // The `day_selected`, `day_today` etc. will handle the stateful styling
  const DayCellContent: DateFormatter = useCallback((day) => {
    const currentDayHasEvents = dayHasEvents(day, events);
    // Return just the number, and the dot if events exist.
    // The parent cell will handle background, borders, etc.
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {day.getDate()}
        {currentDayHasEvents && (
          <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 size-1.5 bg-primary rounded-full" />
        )}
      </div>
    );
  }, [events, dayHasEvents]);
  
  const eventsForSelectedDay = selectedDate ? events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getFullYear() === selectedDate.getFullYear() &&
           eventDate.getMonth() === selectedDate.getMonth() &&
           eventDate.getDate() === selectedDate.getDate();
  }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()) : [];

  return (
    <div className={cn(
        "fixed inset-0 z-[85] bg-[var(--background-color-val)] p-6 flex flex-col",
        "pt-[calc(5rem+2.75rem+1.5rem)]" 
    )}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="font-orbitron text-3xl accent-text">Calendar</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-[var(--text-muted-color-val)] hover:accent-text p-2 rounded-md hover:bg-[var(--input-bg-val)]">
                <X className="w-7 h-7" />
            </Button>
        </div>

        <div className="flex-grow flex gap-6 overflow-hidden">
            <div className="w-2/3 lg:w-3/4 bg-[var(--widget-background-val)] border border-[var(--border-color-val)] rounded-md p-6 flex flex-col items-center justify-start custom-scrollbar-fullscreen">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    month={viewMonth}
                    onMonthChange={setViewMonth}
                    className="w-full max-w-2xl" 
                    classNames={{
                        // These classNames are based on the shadcn/ui Calendar component's structure
                        // If you're using a raw react-day-picker, some might need adjustment
                        // but shadcn/ui one is pre-styled.
                        root: "w-full", 
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center h-10 mb-2", // Added mb-2
                        caption_label: "text-xl font-orbitron accent-text",
                        nav: "space-x-1 flex items-center",
                        nav_button: cn(
                            "h-8 w-8 bg-transparent p-0 opacity-80 hover:opacity-100",
                            "rounded-md hover:bg-accent/20 text-muted-foreground hover:text-accent-foreground transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" // Standard focus
                        ),
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex w-full mb-1", // shadcn uses mb-1
                        head_cell: "text-muted-foreground rounded-md w-[14.28%] text-xs font-medium p-1 h-8 justify-center", // Approx 1/7 width

                        row: "flex w-full mt-2", // shadcn uses mt-2
                        cell: "text-center text-sm p-0 relative w-[14.28%] h-16 sm:h-20 focus-within:relative focus-within:z-20", // Approx 1/7 width
                        
                        day: cn(
                            "w-full h-full p-0 font-normal rounded-md",
                            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", // Standard hover/focus
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", // Standard focus
                            "transition-colors"
                            // "aria-selected:opacity-100" // This is usually handled by day_selected
                        ),
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary focus:text-primary-foreground",
                        day_today: "bg-accent text-accent-foreground ring-1 ring-primary/60", // Adjusted 'today' style to match typical shadcn
                        day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                        day_disabled: "text-muted-foreground opacity-50 pointer-events-none",
                        day_hidden: "invisible",
                        // No 'day_range_start', 'day_range_end', 'day_range_middle' for single mode
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

            {/* Events List / Form section remains the same */}
            <div className="w-1/3 lg:w-1/4 bg-[var(--widget-background-val)] border border-[var(--border-color-val)] rounded-md p-4 flex flex-col space-y-4 overflow-y-auto custom-scrollbar-fullscreen">
                <Button onClick={() => { setEditingEvent(null); setShowEventForm(true); }} className="w-full btn btn-primary">
                    <PlusCircle className="w-4 h-4 mr-2"/> Add Event
                </Button>

                {showEventForm && (
                    <div className="p-3 border border-[var(--border-color-val)] rounded-md bg-[var(--input-bg-val)] space-y-3">
                        <h3 className="font-orbitron text-lg accent-text">{editingEvent ? 'Edit Event' : 'New Event'}</h3>
                        <Input name="title" placeholder="Event Title" value={formData.title} onChange={handleInputChange} className="input-field"/>
                        <div className="flex gap-2">
                            <Input name="date" type="date" value={formData.date} onChange={handleInputChange} className="input-field"/>
                            <Input name="time" type="time" value={formData.time} onChange={handleInputChange} className="input-field"/>
                        </div>
                        <Select name="category" value={formData.category} onValueChange={handleCategoryChange}>
                            <SelectTrigger className="input-field"><SelectValue placeholder="Category" /></SelectTrigger>
                            <SelectContent className="bg-[var(--widget-background-val)] border-[var(--border-color-val)]">
                                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Textarea name="description" placeholder="Description (optional)" value={formData.description} onChange={handleInputChange} className="input-field min-h-[60px]"/>
                        <div className="flex gap-2">
                            <Button onClick={handleSubmitEvent} className="flex-grow btn-primary">{editingEvent ? 'Save Changes' : 'Add Event'}</Button>
                            <Button variant="outline" onClick={resetForm} className="border-[var(--border-color-val)] text-[var(--text-muted-color-val)] hover:bg-[var(--background-color-val)]">Cancel</Button>
                        </div>
                    </div>
                )}

                {!showEventForm && selectedDate && (
                    <div>
                        <h3 className="font-orbitron text-lg accent-text mb-2">
                            Events for: {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </h3>
                        {eventsForSelectedDay.length > 0 ? (
                            <ul className="space-y-2">
                                {eventsForSelectedDay.map(event => (
                                    <li key={event.id} className="p-2.5 bg-[var(--input-bg-val)] border border-[var(--border-color-val)] rounded-md">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-sm text-foreground">{event.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {event.category}
                                                </p>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <Button variant="ghost" size="icon" onClick={() => openEditForm(event)} className="btn-icon w-6 h-6"><Edit className="w-3.5 h-3.5"/></Button>
                                                <Button variant="ghost" size="icon" onClick={() => onDeleteEvent(event.id)} className="btn-icon danger w-6 h-6"><Trash2 className="w-3.5 h-3.5"/></Button>
                                            </div>
                                        </div>
                                        {event.description && <p className="text-xs text-foreground mt-1 pt-1 border-t border-[var(--border-color-val)]/50">{event.description}</p>}
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
import { X, Edit, Trash2 } from 'lucide-react';

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
  const [newGoalUnit, setNewGoalUnit] = useState('km');
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
      setNewGoalUnit('km');
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
        parseFloat(editGoalCurrent),
        editGoalName.trim() || undefined,
        parseFloat(editGoalTarget) > 0 ? parseFloat(editGoalTarget) : undefined,
        editGoalUnit.trim() || undefined
      );
      setEditingGoalId(null);
    }
  };

  const filteredGoals = goals.filter(goal => goal.category === currentCategory);

  return (
    <div className="p-6 pt-8 space-y-6 h-full flex flex-col bg-background text-foreground">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-orbitron font-bold text-primary">Goals</h2> {/* Orbitron Font */}
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-6 h-6" />
        </Button>
      </div>

      <div className="space-y-3 p-4 bg-card border border-border rounded-lg">
        <Input
          placeholder="Goal name..."
          value={newGoalName}
          onChange={(e) => setNewGoalName(e.target.value)}
          className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
        />
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Target value (e.g., 100 for %)"
            value={newGoalTarget}
            onChange={(e) => setNewGoalTarget(e.target.value)}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
          />
          <Input
            placeholder="Unit (e.g., %, km, tasks)"
            value={newGoalUnit}
            onChange={(e) => setNewGoalUnit(e.target.value)}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
          />
        </div>
        <Select value={newGoalCategory} onValueChange={(val) => setNewGoalCategory(val as Category)}>
          <SelectTrigger className="w-full bg-input border-border text-foreground focus:border-primary">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border text-popover-foreground">
            {categories.map(cat => <SelectItem key={cat} value={cat} className="hover:!bg-accent focus:!bg-accent">{cat}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={handleAddGoal} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Add New Goal</Button>
      </div>

      <div className="flex-grow overflow-y-auto space-y-4 pr-1">
        {filteredGoals.map(goal => (
          <div key={goal.id} className="p-4 bg-card border border-border rounded-md">
            {editingGoalId === goal.id ? (
              <div className="space-y-2">
                <Input value={editGoalName} onChange={e => setEditGoalName(e.target.value)} placeholder="Goal Name" className="bg-input border-border text-foreground focus:border-primary"/>
                <div className="flex gap-2">
                    <Input type="number" value={editGoalCurrent} onChange={e => setEditGoalCurrent(e.target.value)} placeholder="Current Value" className="bg-input border-border text-foreground focus:border-primary"/>
                    <Input type="number" value={editGoalTarget} onChange={e => setEditGoalTarget(e.target.value)} placeholder="Target Value" className="bg-input border-border text-foreground focus:border-primary"/>
                    <Input value={editGoalUnit} onChange={e => setEditGoalUnit(e.target.value)} placeholder="Unit" className="bg-input border-border text-foreground focus:border-primary"/>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpdateGoal} size="sm" className="bg-primary text-primary-foreground">Save</Button>
                  <Button onClick={() => setEditingGoalId(null)} variant="outline" size="sm" className="border-border text-foreground hover:bg-accent">Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{goal.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Progress: {goal.currentValue}{goal.unit} / {goal.targetValue}{goal.unit}
                      {goal.category !== currentCategory && ` (${goal.category})`}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(goal)} className="text-muted-foreground hover:text-primary w-7 h-7">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDeleteGoal(goal.id)} className="text-muted-foreground hover:text-destructive w-7 h-7">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Progress value={(goal.currentValue / goal.targetValue) * 100} className="mt-2 h-3 bg-input" indicatorClassName="bg-primary" />
                <p className="text-right text-xs text-primary mt-1 font-semibold">
                  {Math.round((goal.currentValue / goal.targetValue) * 100)}%
                </p>
              </>
            )}
          </div>
        ))}
        {filteredGoals.length === 0 && (
          <p className="text-center text-muted-foreground py-4">No goals in this category. Set some aspirations!</p>
        )}
      </div>
    </div>
  );
}

```

## src/components/views/NotesView.tsx

```typescript
"use client";

import React, { useState } from 'react';
import { Note, Category } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Edit, Trash2 } from 'lucide-react';

interface NotesViewProps {
  notes: Note[];
  categories: Category[];
  currentCategory: Category;
  onAddNote: (title: string | undefined, content: string, category: Category) => void;
  onUpdateNote: (noteId: string, title: string | undefined, content: string) => void;
  onDeleteNote: (noteId: string) => void;
  onClose: () => void;
}

export function NotesView({ notes, categories, currentCategory, onAddNote, onUpdateNote, onDeleteNote, onClose }: NotesViewProps) {
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<Category>(currentCategory);

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteTitle, setEditNoteTitle] = useState('');
  const [editNoteContent, setEditNoteContent] = useState('');

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      onAddNote(newNoteTitle.trim() || undefined, newNoteContent.trim(), newNoteCategory);
      setNewNoteTitle('');
      setNewNoteContent('');
    }
  };

  const startEdit = (note: Note) => {
    setEditingNoteId(note.id);
    setEditNoteTitle(note.title || '');
    setEditNoteContent(note.content);
  };

  const handleUpdateNote = () => {
    if (editingNoteId && editNoteContent.trim()) {
      onUpdateNote(editingNoteId, editNoteTitle.trim() || undefined, editNoteContent.trim());
      setEditingNoteId(null);
    }
  };
  
  const filteredNotes = notes.filter(note => note.category === currentCategory);

  return (
    <div className="p-6 pt-8 space-y-6 h-full flex flex-col bg-background text-foreground">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-orbitron font-bold text-primary">Notes</h2> {/* Orbitron Font */}
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-6 h-6" />
        </Button>
      </div>

      <div className="space-y-3 p-4 bg-card border border-border rounded-lg">
        <Input
          placeholder="Note title (optional)..."
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
        />
        <Textarea
          placeholder="Type your note here..."
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          className="min-h-[100px] bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
        />
        <div className="flex gap-2">
            <Select value={newNoteCategory} onValueChange={(val) => setNewNoteCategory(val as Category)}>
                <SelectTrigger className="w-full bg-input border-border text-foreground focus:border-primary">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-popover-foreground">
                    {categories.map(cat => <SelectItem key={cat} value={cat} className="hover:!bg-accent focus:!bg-accent">{cat}</SelectItem>)}
                </SelectContent>
            </Select>
            <Button onClick={handleAddNote} className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap">Add New Note</Button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto space-y-3 pr-1">
        {filteredNotes.map(note => (
          <div key={note.id} className="p-3 bg-card border border-border rounded-md">
            {editingNoteId === note.id ? (
               <div className="space-y-2">
                <Input value={editNoteTitle} onChange={e => setEditNoteTitle(e.target.value)} placeholder="Title (optional)" className="bg-input border-border text-foreground focus:border-primary"/>
                <Textarea value={editNoteContent} onChange={e => setEditNoteContent(e.target.value)} placeholder="Content" className="min-h-[80px] bg-input border-border text-foreground focus:border-primary"/>
                <div className="flex gap-2">
                  <Button onClick={handleUpdateNote} size="sm" className="bg-primary text-primary-foreground">Save</Button>
                  <Button onClick={() => setEditingNoteId(null)} variant="outline" size="sm" className="border-border text-foreground hover:bg-accent">Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-1">
                    <div>
                        {note.title && <h4 className="text-md font-semibold text-foreground">{note.title}</h4>}
                        <p className="text-xs text-muted-foreground">
                            Last edited: {new Date(note.lastEdited).toLocaleDateString()}
                            {note.category !== currentCategory && ` (${note.category})`}
                        </p>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(note)} className="text-muted-foreground hover:text-primary w-7 h-7">
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDeleteNote(note.id)} className="text-muted-foreground hover:text-destructive w-7 h-7">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap">{note.content}</p>
              </>
            )}
          </div>
        ))}
        {filteredNotes.length === 0 && (
          <p className="text-center text-muted-foreground py-4">No notes in this category. Write something down!</p>
        )}
      </div>
    </div>
  );
}

```

## src/components/views/TasksView.tsx

```typescript
"use client";

import React, { useState } from 'react';
import { Task, Category } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Edit, Trash2, CalendarDays, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TasksViewProps {
  tasks: Task[];
  categories: Category[];
  currentCategory: Category;
  onAddTask: (taskText: string, dueDate: string | undefined, category: Category) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, newText: string, newDueDate?: string, newCategory?: Category) => void;
  onClose: () => void;
}

export function TasksView({ tasks, categories, currentCategory, onAddTask, onToggleTask, onDeleteTask, onUpdateTask, onClose }: TasksViewProps) {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<Category>(currentCategory);
  
  const [editingTask, setEditingTask] = useState<Task | null>(null); // Store full task for editing
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [showCompleted, setShowCompleted] = useState(false);

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim(), newTaskDueDate || undefined, newTaskCategory);
      setNewTaskText('');
      setNewTaskDueDate('');
      // Keep newTaskCategory as is, or reset to currentCategory
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

  const handleSaveEditedTask = (formData: {text: string; dueDate?: string; category: Category}) => {
    if (editingTask) {
        onUpdateTask(editingTask.id, formData.text, formData.dueDate, formData.category);
        closeEditModal();
    }
  };


  const filteredTasks = tasks
    .filter(task => (currentCategory === "All Projects" || task.category === currentCategory) && (showCompleted || !task.completed))
    .sort((a,b) => (a.completed ? 1 : -1) || (a.dueDate && b.dueDate ? new Date(a.dueDate+"T00:00:00Z").getTime() - new Date(b.dueDate+"T00:00:00Z").getTime() : (a.dueDate ? -1 : (b.dueDate ? 1 : 0))));

  return (
    <div className={cn(
        "fixed inset-0 z-[85] bg-[var(--background-color-val)] p-6 flex flex-col",
        "pt-[calc(5rem+2.75rem+1.5rem)]" // Padding for header & project bar
    )}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-orbitron text-3xl accent-text">Tasks</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-[var(--text-muted-color-val)] hover:accent-text p-2 rounded-md hover:bg-[var(--input-bg-val)]">
          <X className="w-7 h-7" />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto bg-[var(--widget-background-val)] border border-[var(--border-color-val)] rounded-md p-6 custom-scrollbar-fullscreen space-y-6">
        {/* Add Task Form */}
        <div className="space-y-3 p-4 bg-[var(--input-bg-val)] border border-[var(--border-color-val)] rounded-md">
          <Input
            type="text"
            placeholder="Add new task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="input-field text-base p-3" // Target style
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="input-field text-sm"
            />
            <Select value={newTaskCategory} onValueChange={(val) => setNewTaskCategory(val as Category)}>
              <SelectTrigger className="input-field text-sm h-auto py-2.5">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-[var(--widget-background-val)] border-[var(--border-color-val)] text-[var(--text-color-val)]">
                {categories.map(cat => <SelectItem key={cat} value={cat} className="hover:!bg-[rgba(0,220,255,0.1)] focus:!bg-[rgba(0,220,255,0.1)]">{cat}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={handleAddTask} className="btn btn-primary sm:col-span-1 text-sm h-auto py-2.5"> {/* Target style */}
                <PlusCircle className="w-4 h-4 mr-2"/> Add Task
            </Button>
          </div>
        </div>

        <div className="flex justify-end items-center">
           <label htmlFor="task-show-completed-fs" className="flex items-center text-xs text-[var(--text-muted-color-val)] cursor-pointer">
             <Checkbox
                id="task-show-completed-fs"
                checked={showCompleted}
                onCheckedChange={(checked) => setShowCompleted(Boolean(checked))}
                className="mr-1.5 h-3.5 w-3.5 border-[var(--text-muted-color-val)] data-[state=checked]:bg-[var(--accent-color-val)] data-[state=checked]:border-[var(--accent-color-val)] data-[state=checked]:text-[var(--background-color-val)]"
              /> Show Completed
            </label>
        </div>

        {/* Tasks List */}
        <ul className="space-y-2.5">
          {filteredTasks.map(task => (
            <li key={task.id} className={cn("widget-item p-3 flex justify-between items-start", task.completed && "opacity-60")}>
                <div className="flex items-start flex-grow min-w-0"> {/* Added min-w-0 for truncation */}
                    <Checkbox
                      id={`task-fs-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => onToggleTask(task.id)}
                      className="form-checkbox h-5 w-5 shrink-0 mt-0.5 mr-3 border-[var(--text-muted-color-val)] data-[state=checked]:bg-[var(--accent-color-val)] data-[state=checked]:border-[var(--accent-color-val)] data-[state=checked]:text-[var(--background-color-val)]"
                    />
                    <div className="flex-grow">
                        <span className={cn("text-base block", task.completed && "line-through")}>{task.text}</span>
                        <p className="text-xs text-[var(--text-muted-color-val)] mt-0.5">
                            {task.category}
                            {task.dueDate && (
                                <>
                                    <span className="mx-1">•</span>
                                    <CalendarDays className="w-3 h-3 inline mr-1" />
                                    {new Date(task.dueDate + "T00:00:00Z").toLocaleDateString()}
                                </>
                            )}
                        </p>
                    </div>
              </div>
              <div className="flex items-center space-x-1 shrink-0 ml-2">
                 <Button variant="ghost" size="icon" onClick={() => openEditModal(task)} className="btn-icon w-7 h-7"><Edit className="w-4 h-4" /></Button>
                 <Button variant="ghost" size="icon" onClick={() => onDeleteTask(task.id)} className="btn-icon danger w-7 h-7"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </li>
          ))}
           {filteredTasks.length === 0 && (
            <p className="text-center text-[var(--text-muted-color-val)] py-10">No tasks found for this view.</p>
          )}
        </ul>
      </div>

      {/* Edit Task Modal */}
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

// Separate EditTaskModal component (can be in the same file or separate)
interface EditTaskModalProps {
    task: Task;
    categories: Category[];
    onClose: () => void;
    onSave: (formData: {text: string; dueDate?: string; category: Category}) => void;
}
function EditTaskModal({ task, categories, onClose, onSave }: EditTaskModalProps) {
    const [text, setText] = useState(task.text);
    const [dueDate, setDueDate] = useState(task.dueDate || '');
    const [category, setCategory] = useState(task.category);

    const handleSubmit = () => {
        if(text.trim()) {
            onSave({ text: text.trim(), dueDate: dueDate || undefined, category });
        }
    };
    return (
        <div className="fixed inset-0 bg-[var(--background-color-val)]/80 backdrop-blur-sm flex items-center justify-center z-[110]" onClick={onClose}>
            <div className="bg-[var(--widget-background-val)] border border-[var(--border-color-val)] rounded-lg p-6 w-full max-w-lg shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center pb-3 border-b border-[var(--border-color-val)]">
                    <h3 className="font-orbitron text-xl accent-text">Edit Task</h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-[var(--text-muted-color-val)] hover:accent-text"><X className="w-5 h-5"/></Button>
                </div>
                <Input value={text} onChange={e => setText(e.target.value)} placeholder="Task description" className="input-field p-3"/>
                <div className="grid grid-cols-2 gap-3">
                    <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="input-field p-3"/>
                    <Select value={category} onValueChange={val => setCategory(val as Category)}>
                        <SelectTrigger className="input-field p-3 h-auto"><SelectValue/></SelectTrigger>
                        <SelectContent className="bg-[var(--widget-background-val)] border-[var(--border-color-val)]">
                            {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex justify-end pt-4 border-t border-[var(--border-color-val)] space-x-2">
                    <Button variant="outline" onClick={onClose} className="border-[var(--border-color-val)] text-[var(--text-muted-color-val)] hover:bg-[var(--input-bg-val)]">Cancel</Button>
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

import React from 'react';
import { UserCircle2 } from 'lucide-react'; // Replaced Lock with UserCircle for now
import { AyandaLogoIcon } from './AyandaLogoIcon'; // Import the new logo icon
import { cn } from '@/lib/utils';

// Header no longer manages category state, that will be in ProjectSelectorBar
export function Header() {
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-[95]", // z-index from target
        "flex items-center justify-between",
        "px-6 py-4", // padding from target (1rem = 16px, 1.5rem = 24px)
        "bg-[var(--background-color-val)]", // Background from target
        "shadow-[0_2px_10px_rgba(0,0,0,0.2)]" // Box shadow from target
      )}
      style={{ height: '5rem' }} // Explicit height to match target padding
    >
      {/* Left Section: Logo */}
      <div className="flex items-center space-x-3"> {/* space-x from target */}
        <AyandaLogoIcon /> {/* Use the new SVG icon */}
        <h1 className="font-orbitron text-3xl font-bold tracking-wider accent-text">AYANDA</h1>
      </div>
      
      {/* Right Section: Icons */}
      {/* Target HTML only shows user icon, Lock icon removed for closer match */}
      <div className="flex items-center gap-3">
         <button className="p-0 bg-transparent border-none text-slate-400 hover:accent-text cursor-pointer">
            <UserCircle2 className="w-9 h-9" /> {/* Size from target */}
        </button>
      </div>
    </header>
  );
}

```

## src/components/layout/ProjectSelectorBar.tsx

```typescript
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Cog } from 'lucide-react'; // Cog for settings
import { Category } from '@/types'; // Assuming Category is similar to Project conceptually
import { cn } from '@/lib/utils';

interface ProjectSelectorBarProps {
  currentCategory: Category; // Renamed from currentProject for consistency
  onCategoryChange: (category: Category) => void;
  availableCategories: Category[];
  // onManageProjects: () => void; // Callback to open manage projects modal
}

export function ProjectSelectorBar({ 
  currentCategory, 
  onCategoryChange, 
  availableCategories 
  // onManageProjects 
}: ProjectSelectorBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSelectCategory = (category: Category | null) => { // Allow null for "All Projects"
    onCategoryChange(category || "All Projects" as Category); // Default to "All Projects" if null
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
        "fixed left-0 right-0 z-[90]", // z-index from target
        "bg-[var(--background-color-val)]",
        "px-6 py-3", // padding from target (0.75rem = 12px, 1.5rem = 24px)
        "shadow-[0_2px_5px_rgba(0,0,0,0.1)]",
        "flex items-center justify-center"
      )}
      style={{ top: '5rem' }} // Position below header
    >
      <div className="relative"> {/* Container for pill and dropdown */}
        <div
          ref={pillRef}
          onClick={toggleDropdown}
          className={cn(
            "bg-[var(--widget-background-val)] border border-[var(--border-color-val)]",
            "rounded-full px-5 py-2", // padding 0.5rem 1.25rem
            "text-sm font-medium cursor-pointer",
            "flex items-center min-w-[220px] justify-between",
            "transition-colors duration-200 hover:border-[var(--accent-color-val)] hover:bg-[rgba(0,220,255,0.05)]"
          )}
        >
          <span>{displayCategoryName}</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>

        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className={cn(
              "absolute mt-2 bg-[#141D26] border border-[var(--border-color-val)] rounded-md", // Original was 0.5rem
              "w-[250px] max-h-[300px] overflow-y-auto",
              "shadow-[0_8px_25px_rgba(0,0,0,0.4)] z-[100]",
              "transition-all duration-200 ease-out",
              isDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2.5"
            )}
            style={{ top: 'calc(100% + 0.5rem)'}} // Position dropdown below pill
          >
            <div 
              className={cn(
                "px-4 py-2.5 cursor-pointer text-sm", // padding 0.6rem 1rem
                (currentCategory === "All Projects" || !availableCategories.includes(currentCategory as Category)) ? "bg-[rgba(0,220,255,0.1)] text-[var(--accent-color-val)] font-medium" : "hover:bg-[rgba(0,220,255,0.1)]"
              )}
              onClick={() => handleSelectCategory("All Projects" as Category)} // Treat "All Projects" distinctly
            >
              All Projects
            </div>
            {availableCategories.map(cat => (
              <div
                key={cat}
                className={cn(
                  "px-4 py-2.5 cursor-pointer text-sm",
                  currentCategory === cat ? "bg-[rgba(0,220,255,0.1)] text-[var(--accent-color-val)] font-medium" : "hover:bg-[rgba(0,220,255,0.1)]"
                )}
                onClick={() => handleSelectCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Manage Projects Button - functionality to be added if needed */}
       <button 
        // onClick={onManageProjects} 
        title="Manage Projects" 
        className="ml-3 p-2 rounded-full hover:bg-[var(--input-bg-val)] text-[var(--text-muted-color-val)] hover:accent-text"
      >
        <Cog className="w-5 h-5" />
      </button>
    </div>
  );
}

```

## src/types/index.ts

```
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string; // YYYY-MM-DD format
  category: string; // This is used like projectId
}

export interface Goal {
  id: string;
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  category: string; // This is used like projectId
}

export interface Note {
  id: string;
  title?: string;
  content: string;
  category: string; // This is used like projectId
  lastEdited: string; // ISO string
}

// Define the Event type (or AppEvent if you prefer to keep the alias)
export interface Event {
  id: string;
  title: string; // Or 'name' if that's what your data uses
  date: string; // ISO string for the event's date and time
  duration?: number; // Optional: duration in minutes
  description?: string; // Optional
  category: string; // This is used like projectId (align with how you use it in DueSoonWidget)
  // lastEdited?: string; // If this field is used for event date like in the previous version of DueSoonWidget
}


export type ViewMode = "dashboard" | "tasks" | "goals" | "notes" | "calendar"; // Added calendar

export type Category = "All Projects" | "Personal Life" | "Work" | "Studies"; // Added "All Projects"
// Or, if Category should map to Project names from your HTML data:
// export type Category = "All Projects" | "Personal Life" | "Work Project X" | "Learning Hub";

```

## src/app/favicon.ico

```
**Note:** File appears to be binary or uses an incompatible encoding.
Content not displayed.
```

## src/app/globals.css

```css
@import "tailwindcss";
/* Ensure 'tailwindcss-custom-variants' plugin is installed and configured if using @custom-variant */
/* Or remove if not using: npm uninstall tailwindcss-custom-variants */
/* @custom-variant dark (&:is(.dark *)); */

@theme inline {
  /* Make CSS variables available to Tailwind's theme() and JIT engine */
  --accent-color: var(--accent-color-val);
  --background-color: var(--background-color-val);
  --widget-background: var(--widget-background-val);
  --text-color: var(--text-color-val);
  --text-muted-color: var(--text-muted-color-val);
  --border-color: var(--border-color-val);
  --input-bg: var(--input-bg-val);
  --danger-color: var(--danger-color-val);

  /* Shadcn/ui compatibility - map our theme to shadcn's expected vars */
  --background: var(--background-color-val); /* For shadcn body bg */
  --foreground: var(--text-color-val);     /* For shadcn body text */
  --card: var(--widget-background-val);       /* For shadcn Card component bg */
  --card-foreground: var(--text-color-val);   /* For shadcn Card component text */
  --popover: var(--widget-background-val);    /* For shadcn Popover component bg */
  --popover-foreground: var(--text-color-val);/* For shadcn Popover component text */
  --primary: var(--accent-color-val);         /* For shadcn primary elements */
  --primary-foreground: var(--background-color-val); /* Text on primary elements */
  --secondary: var(--input-bg-val);           /* A secondary background */
  --secondary-foreground: var(--text-color-val); /* Text on secondary */
  --muted: var(--input-bg-val);               /* Muted background */
  --muted-foreground: var(--text-muted-color-val); /* Muted text */
  --accent: hsl(var(--accent-color-hsl) / 0.1); /* Accent bg (e.g., hover), derived from accent-color */
  --accent-foreground: var(--accent-color-val);  /* Text on accent bg */
  --destructive: var(--danger-color-val);
  --destructive-foreground: var(--text-color-val);
  --border: var(--border-color-val);          /* For shadcn borders */
  --input: var(--border-color-val);           /* For shadcn input borders */
  --ring: hsl(var(--accent-color-hsl) / 0.5); /* Focus ring, derived */

  --radius: 0.75rem; /* Default border radius for shadcn components */

  /* Fonts */
  --font-sans: var(--font-inter);
  --font-orbitron: var(--font-orbitron-val);
  --font-inter: 'Inter', sans-serif;
  --font-orbitron-val: 'Orbitron', sans-serif;
}

:root {
    --accent-color-val: #00DCFF; /* Vivid Cyan */
    --accent-color-hsl: 190 100% 50%; /* HSL for opacity variants, approx #00DCFF */
    --background-color-val: #0A0F14; /* Very Dark Blue/Gray */
    --widget-background-val: #101820; /* Darker than accent, lighter than bg */
    --text-color-val: #E0E7FF; /* Soft Lavender White */
    --text-muted-color-val: #707A8A; /* Muted Blue/Gray */
    --border-color-val: rgba(0, 220, 255, 0.08); /* Softer border */
    --input-bg-val: rgba(255, 255, 255, 0.03);
    --danger-color-val: #FF4757;
}

@layer base {
  body {
    font-family: var(--font-inter);
    background-color: var(--background-color-val);
    color: var(--text-color-val);
    overflow-x: hidden;
    /* padding-top: is handled by main layout component now */
  }
  * {
    /* Apply border-color by default using Tailwind's border class + CSS var */
    /* This is more for shadcn components that expect --border */
     border-color: var(--border-color-val);
  }
  /* Custom scrollbar for webkit browsers */
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.02);
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 220, 255, 0.2);
    border-radius: 2px;
  }
  /* For Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 220, 255, 0.2) rgba(255,255,255,0.02);
  }
}

@layer components {
  /* Replicating styles from provided HTML for direct use if needed, or as reference for Tailwind classes */
  .widget-item {
    background-color: var(--input-bg-val);
    padding: 0.625rem 0.875rem; /* 10px 14px */
    border-radius: 0.375rem; /* 6px */
    font-size: 0.875rem; /* 14px */
    border-left: 3px solid transparent;
    transition-property: border-color, background-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
    word-break: break-word;
  }
  .widget-item:hover {
    border-left-color: var(--accent-color-val);
    background-color: rgba(0, 220, 255, 0.05);
  }
}

@layer utilities {
    .font-orbitron { font-family: var(--font-orbitron-val); }
    .accent-text { color: var(--accent-color-val); }
}

```

## src/app/layout.tsx

```typescript
import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Matches CSS variable in globals.css
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron-val", // Matches CSS variable in globals.css
  weight: ["500", "700"], // As used in the target HTML
  display: 'swap',
});

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
    <html lang="en" className="dark"> {/* Assuming dark is the default and only theme */}
      <body
        className={cn(
          inter.variable,
          orbitron.variable,
          "antialiased min-h-screen" // bg and text color applied via @layer base in globals.css
        )}
      >
        {children}
      </body>
    </html>
  );
}

```

## src/app/page.tsx

```typescript
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { ProjectSelectorBar } from '@/components/layout/ProjectSelectorBar';
import { FooterChat } from '@/components/layout/FooterChat';
import { TasksWidget } from '@/components/dashboard/TasksWidget';
import { CalendarWidget } from '@/components/dashboard/CalendarWidget';
import { GoalsWidget } from '@/components/dashboard/GoalsWidget';
import { QuickNotesWidget } from '@/components/dashboard/QuickNotesWidget';
import { DueSoonWidget } from '@/components/dashboard/DueSoonWidget';
import { TasksView } from '@/components/views/TasksView';
import { GoalsView } from '@/components/views/GoalsView';
import { NotesView } from '@/components/views/NotesView';
import { CalendarFullScreenView } from '@/components/views/CalendarFullScreenView';
import { Task, Goal, Note, Event as AppEvent, ViewMode, Category } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';

const initialProjectsData: { id: string, name: Category }[] = [
    { id: 'proj_personal', name: 'Personal Life' },
    { id: 'proj_work', name: 'Work' },
    { id: 'proj_learning', name: 'Studies' }
];
const baseAvailableCategories: Category[] = initialProjectsData.map(p => p.name);
const availableCategoriesForDropdown: Category[] = ["All Projects", ...baseAvailableCategories];


const initialTasks: Task[] = [
  { id: 't1', text: 'Buy groceries for the weekend, including milk, eggs, bread, and that new cereal Ayanda likes.', completed: false, category: 'Personal Life', dueDate: '2024-10-28' },
  { id: 't2', text: 'Finalize Q4 report slides and send to marketing team.', completed: false, category: 'Work', dueDate: '2024-10-29' },
  { id: 't3', text: 'Read Chapter 3 of "Eloquent JavaScript".', completed: true, category: 'Studies', dueDate: '2024-10-25' },
  { id: 't4', text: 'Call Mom for her birthday.', completed: false, category: 'Personal Life', dueDate: '2024-10-27' },
  { id: 't5', text: 'Clean the apartment.', completed: false, category: 'Personal Life', dueDate: '2024-10-30' },
  { id: 't6', text: 'Submit Q1 proposal.', completed: false, category: 'Work', dueDate: '2024-11-01' },
];

const initialGoals: Goal[] = [
  { id: 'g1', name: 'Run 5km without stopping', currentValue: 2, targetValue: 5, unit: 'km', category: 'Personal Life' },
  { id: 'g2', name: 'Complete Figma Advanced UI Course', currentValue: 60, targetValue: 100, unit: '%', category: 'Studies' },
  { id: 'g3', name: 'Client retention rate to 90%', currentValue: 85, targetValue: 90, unit: '%', category: 'Work' },
];

const initialNotes: Note[] = [
  { id: 'n1', title: 'Coffee Shop Idea', content: 'The Daily Grind - good for client meetings. Has good Wi-Fi.', category: 'Work', lastEdited: '2024-10-24T10:00:00Z' },
  { id: 'n2', title: 'Book Recommendation', content: '"Atomic Habits" by James Clear. Very insightful for building good routines.', category: 'Personal Life', lastEdited: '2024-10-22T09:15:00Z' },
  { id: 'n3', title: 'JS Array Methods', content: 'Remember: map, filter, reduce, find, some, every. Practice more with reduce.', category: 'Studies', lastEdited: '2024-10-20T11:00:00Z' },
];

const initialEvents: AppEvent[] = [
  { id: 'e1', title: 'Team Meeting - Q4 Planning', date: '2024-10-29T10:00:00Z', category: 'Work', description: 'Discuss Q4 goals and roadmap.' },
  { id: 'e2', title: 'Doctor Appointment', date: '2024-11-05T14:30:00Z', category: 'Personal Life', description: 'Dr. Smith, Room 302.' },
  { id: 'e3', title: 'Webinar: Advanced CSS', date: '2024-10-30T18:00:00Z', category: 'Studies', description: 'Online link in email.' },
  { id: 'e4', title: 'Client Call - Project Alpha', date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), category: 'Work', description: 'Follow up on feedback.' },
];


export default function HomePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [projects, setProjects] = useState(initialProjectsData);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [events, setEvents] = useState<AppEvent[]>(initialEvents);
  
  const [currentCategory, setCurrentCategory] = useState<Category>("All Projects");

  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<AppEvent[]>([]);

  const filterData = useCallback(() => {
    const isAllProjects = currentCategory === "All Projects";
    setFilteredTasks(
        tasks
            .filter(t => isAllProjects || t.category === currentCategory)
            .sort((a,b) => (a.completed ? 1 : -1) || (a.dueDate && b.dueDate ? new Date(a.dueDate+"T00:00:00Z").getTime() - new Date(b.dueDate+"T00:00:00Z").getTime() : (a.dueDate ? -1 : (b.dueDate ? 1 : 0))))
    );
    setFilteredGoals(goals.filter(g => isAllProjects || g.category === currentCategory));
    setFilteredNotes(notes.filter(n => isAllProjects || n.category === currentCategory).sort((a,b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()));
    setFilteredEvents(events.filter(e => isAllProjects || e.category === currentCategory));
  }, [tasks, goals, notes, events, currentCategory]);

  useEffect(() => {
    filterData();
  }, [filterData]);

  const handleAddTask = (text: string, dueDate: string | undefined, category: Category) => {
    const effectiveCategory = (category === "All Projects" || !baseAvailableCategories.includes(category)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : category;
    const newTask: Task = { id: uuidv4(), text, completed: false, dueDate, category: effectiveCategory };
    setTasks(prev => [...prev, newTask]);
  };
  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };
  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };
  const handleUpdateTask = (taskId: string, newText: string, newDueDate?: string, newCategory?: Category) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, text: newText, dueDate: newDueDate, category: newCategory || t.category } : t));
  };

  const handleAddGoal = (name: string, targetValue: number, unit: string, category: Category) => {
    const effectiveCategory = (category === "All Projects" || !baseAvailableCategories.includes(category)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : category;
    const newGoal: Goal = { id: uuidv4(), name, currentValue: 0, targetValue, unit, category: effectiveCategory };
    setGoals(prev => [...prev, newGoal]);
  };
  const handleUpdateGoal = (goalId: string, currentValue?: number, name?: string, targetValue?: number, unit?: string, category?: Category) => {
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        const currentTgt = targetValue ?? g.targetValue;
        return {
          ...g,
          currentValue: currentValue !== undefined ? Math.max(0, Math.min(currentValue, currentTgt)) : g.currentValue,
          name: name ?? g.name, targetValue: currentTgt, unit: unit ?? g.unit, category: category ?? g.category,
        };
      } return g;
    }));
  };
  const handleDeleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  };

  const handleAddNote = (title: string | undefined, content: string, category: Category) => {
    const effectiveCategory = (category === "All Projects" || !baseAvailableCategories.includes(category)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : category;
    const newNote: Note = { id: uuidv4(), title, content, lastEdited: new Date().toISOString(), category: effectiveCategory };
    setNotes(prev => [newNote, ...prev]);
  };
  const handleUpdateNote = (noteId: string, title: string | undefined, content: string, category?: Category) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, title, content, category: category || n.category, lastEdited: new Date().toISOString() } : n));
  };
  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };
  
  const handleAddEvent = (title: string, date: string, category: Category, description?: string) => {
    const effectiveCategory = (category === "All Projects" || !baseAvailableCategories.includes(category)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : category;
    const newEvent: AppEvent = {id: uuidv4(), title, date, category: effectiveCategory, description };
    setEvents(prev => [...prev, newEvent].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };
  const handleUpdateEvent = (eventId: string, title: string, date: string, category: Category, description?: string) => {
     setEvents(prev => prev.map(e => e.id === eventId ? {...e, title, date, category, description} : e).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };
  const handleDeleteEvent = (eventId: string) => {
     setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const handleAiInputCommand = (command: string) => {
    const lowerInput = command.toLowerCase();
    let effectiveCategory = (currentCategory === "All Projects" || !baseAvailableCategories.includes(currentCategory)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : currentCategory;

    if (lowerInput.startsWith("add task:") || lowerInput.startsWith("new task:")) {
        const taskName = command.substring(lowerInput.indexOf(":") + 1).trim();
        if(taskName) handleAddTask(taskName, undefined, effectiveCategory);
    } else if (lowerInput.startsWith("add note:") || lowerInput.startsWith("new note:")) {
        const noteContent = command.substring(lowerInput.indexOf(":") + 1).trim();
        if(noteContent) handleAddNote("AI Note", noteContent, effectiveCategory);
    } else if (lowerInput.startsWith("add project:") || lowerInput.startsWith("new project:")) {
        const projName = command.substring(lowerInput.indexOf(":") + 1).trim() as Category;
         if(projName && !projects.find(p => p.name.toLowerCase() === projName.toLowerCase())) {
             const newProject = { id: uuidv4(), name: projName };
             setProjects(prev => [...prev, newProject]);
             // This would ideally also update baseAvailableCategories and availableCategoriesForDropdown if they were derived from `projects` state.
             // For now, this only adds to `projects` state.
        }
    } else if (lowerInput.startsWith("add goal:") || lowerInput.startsWith("new goal:")) {
        const goalName = command.substring(lowerInput.indexOf(":") + 1).trim();
        if(goalName) handleAddGoal(goalName, 100, "%", effectiveCategory);
    } else { if(command) handleAddTask(command, undefined, effectiveCategory); }
  };

  const renderView = () => {
    const commonViewProps = {
        categories: baseAvailableCategories, // Use projects derived categories
        currentCategory: (currentCategory === "All Projects" || !baseAvailableCategories.includes(currentCategory)) && baseAvailableCategories.length > 0 ? baseAvailableCategories[0] : currentCategory,
        onClose: () => setViewMode('dashboard'),
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
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            <div className="lg:row-span-2">
                <TasksWidget tasks={filteredTasks} onTaskToggle={handleToggleTask} onNavigate={() => setViewMode('tasks')} />
            </div>
            <div className="flex flex-col space-y-5 md:space-y-6">
              <CalendarWidget events={filteredEvents} onNavigate={() => setViewMode('calendar')} />
              <DueSoonWidget tasks={tasks} events={events} currentProjectId={currentCategory === "All Projects" ? null : currentCategory} />
            </div>
            <GoalsWidget goals={filteredGoals} onNavigate={() => setViewMode('goals')} />
            <QuickNotesWidget notes={filteredNotes} onNavigate={() => setViewMode('notes')} />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ProjectSelectorBar 
        currentCategory={currentCategory}
        onCategoryChange={(cat) => setCurrentCategory(cat)}
        availableCategories={availableCategoriesForDropdown} // Use all categories including "All Projects"
      />
      <main 
        className={cn(
            "flex-grow px-6 pb-24",
            viewMode === 'dashboard' ? "pt-[calc(5rem+2.875rem+1.5rem)]" : "pt-0" 
        )}
      >
        {renderView()}
      </main>
      <FooterChat onSendCommand={handleAiInputCommand} />
    </div>
  );
}


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

