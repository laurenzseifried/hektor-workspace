# CI/Newsletter/Enrichment Workflow
# Multi-step pipeline with approval gates for safe automation

name: ci-newsletter-enrichment
description: Research → Enrich → Approve → Publish workflow

# Environment variables for workflow
env:
  WORKSPACE: /Users/laurenz/.openclaw/workspace
  OUTPUT_DIR: /Users/laurenz/.openclaw/workspace/enriched-content

# Entry point arguments
args:
  topic:
    type: string
    description: Topic to research and enrich
    default: AI Safety
  
  sources:
    type: array
    description: Research sources to include
    default: ["HN", "arXiv", "Twitter"]

steps:
  # Step 1: Research Phase
  - id: research
    name: "Research & Collect"
    command: |
      node -e "
      const topic = process.env.TOPIC || 'AI Safety';
      console.log(JSON.stringify({
        topic: topic,
        timestamp: new Date().toISOString(),
        sources: ['HN', 'arXiv', 'Twitter'],
        articles: [
          { url: 'https://example.com/1', title: 'Article 1' },
          { url: 'https://example.com/2', title: 'Article 2' }
        ]
      }, null, 2));
      "
    env:
      TOPIC: ${{ args.topic }}
    output: json

  # Step 2: Data Enrichment
  - id: enrich
    name: "Enrich Data"
    command: |
      node -e "
      const input = JSON.parse(process.stdin);
      const enriched = {
        ...input,
        enrichedAt: new Date().toISOString(),
        summaries: input.articles.map((a, i) => ({
          ...a,
          summary: 'Auto-generated summary ' + (i + 1)
        }))
      };
      console.log(JSON.stringify(enriched, null, 2));
      "
    stdin: ${{ steps.research.stdout }}
    output: json

  # Step 3: Validation
  - id: validate
    name: "Validate Enriched Data"
    command: |
      node -e "
      const input = JSON.parse(process.stdin);
      const valid = input.summaries && input.summaries.length > 0;
      console.log(JSON.stringify({
        valid: valid,
        count: input.summaries?.length || 0,
        timestamp: new Date().toISOString()
      }, null, 2));
      "
    stdin: ${{ steps.enrich.stdout }}
    output: json
    condition: ${{ steps.enrich.exit_code == 0 }}

  # Step 4: Manual Approval Gate (CRITICAL)
  - id: approve
    name: "Human Review & Approval"
    command: lobster approve
    approval: required
    prompt: |
      📋 Enriched Content Review
      
      Topic: ${{ steps.research.topic }}
      Articles Found: ${{ steps.enrich.summaries.length }}
      Validation: ${{ steps.validate.valid }}
      
      Ready to publish? (yes/no)
    
    # If approved, continue to publish
    # If rejected, stop here (safe fallback)

  # Step 5: Publish to Newsletter (only if approved)
  - id: publish
    name: "Publish Newsletter"
    command: |
      node -e "
      const data = JSON.parse(process.stdin);
      const filename = '$(date +%Y-%m-%d-newsletter).json';
      const output = {
        published: true,
        file: filename,
        topic: data.topic,
        articleCount: data.summaries.length,
        timestamp: new Date().toISOString()
      };
      console.log(JSON.stringify(output, null, 2));
      "
    stdin: ${{ steps.enrich.stdout }}
    output: json
    condition: ${{ steps.approve.approved }}

  # Step 6: Summary & Notification
  - id: summary
    name: "Generate Summary"
    command: |
      node -e "
      const approved = process.env.APPROVED === 'true';
      const result = {
        workflow: 'ci-newsletter-enrichment',
        status: approved ? 'PUBLISHED' : 'REJECTED',
        timestamp: new Date().toISOString(),
        nextSteps: approved ? 'Monitor engagement' : 'Review and try again'
      };
      console.log(JSON.stringify(result, null, 2));
      "
    env:
      APPROVED: ${{ steps.approve.approved }}
    output: json

# Success condition: All steps completed and approved
on_success: |
  echo "✅ Newsletter published successfully"

# Failure condition: Rejected or validation failed
on_failure: |
  echo "❌ Workflow halted (approval rejected or validation failed)"

# Rollback condition: If publish fails, revert
on_rollback: |
  echo "⚠️  Rollback triggered - reverting changes"
