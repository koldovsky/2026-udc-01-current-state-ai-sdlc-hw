#!/usr/bin/env python3
import os
import argparse
import sys

def main():
    p = argparse.ArgumentParser(description='Minimal Claude CLI using Anthropic Python SDK')
    p.add_argument('prompt', nargs='?', default=None, help='Prompt text (or read from stdin)')
    p.add_argument('--model', default='claude-2.1', help='Model name')
    p.add_argument('--max-tokens', type=int, default=200, help='Max tokens')
    args = p.parse_args()

    prompt = args.prompt
    if not prompt:
        prompt = sys.stdin.read().strip()
        if not prompt:
            p.print_help()
            return

    api_key = os.environ.get('ANTHROPIC_API_KEY') or os.environ.get('CLAUDE_API_KEY')
    if not api_key:
        print("Error: set ANTHROPIC_API_KEY environment variable.")
        return

    try:
        import anthropic
    except Exception:
        print("Please install the 'anthropic' package: pip install anthropic")
        return

    client = anthropic.Client(api_key=api_key)
    # Using a common completion call; SDK args may vary depending on version
    resp = client.completions.create(model=args.model, prompt=prompt, max_tokens_to_sample=args.max_tokens)
    # Print the returned completion text
    print(getattr(resp, 'completion', resp))

if __name__ == '__main__':
    main()
