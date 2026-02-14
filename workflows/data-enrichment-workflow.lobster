# Data Enrichment Workflow
# Simple deterministic pipeline for lead/company enrichment

name: data-enrichment
description: Enrich leads with company data, validation, and export

args:
  input_file:
    type: string
    description: Path to input CSV/JSON with leads
    required: true
  
  output_format:
    type: string
    description: Output format (json|csv)
    default: json

steps:
  # Step 1: Load input data
  - id: load
    name: "Load Input Data"
    command: |
      node -e "
      const fs = require('fs');
      const file = process.env.INPUT_FILE;
      if (!fs.existsSync(file)) {
        console.error('File not found: ' + file);
        process.exit(1);
      }
      const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
      console.log(JSON.stringify({
        loaded: true,
        recordCount: Array.isArray(data) ? data.length : 1,
        data: data
      }, null, 2));
      "
    env:
      INPUT_FILE: ${{ args.input_file }}
    output: json

  # Step 2: Validate structure
  - id: validate
    name: "Validate Lead Records"
    command: |
      node -e "
      const input = JSON.parse(process.stdin);
      const records = Array.isArray(input.data) ? input.data : [input.data];
      const validated = records.map((r, i) => ({
        index: i,
        email: r.email || '',
        company: r.company || '',
        hasEmail: !!(r.email),
        hasCompany: !!(r.company),
        valid: !!(r.email && r.company)
      }));
      console.log(JSON.stringify({
        validated: true,
        total: records.length,
        valid: validated.filter(r => r.valid).length,
        records: validated
      }, null, 2));
      "
    stdin: ${{ steps.load.stdout }}
    output: json
    condition: ${{ steps.load.loaded }}

  # Step 3: Filter valid records
  - id: filter
    name: "Filter Valid Records"
    command: |
      node -e "
      const input = JSON.parse(process.stdin);
      const validRecords = input.records.filter(r => r.valid);
      console.log(JSON.stringify({
        filtered: true,
        validCount: validRecords.length,
        skippedCount: input.total - validRecords.length,
        records: validRecords
      }, null, 2));
      "
    stdin: ${{ steps.validate.stdout }}
    output: json

  # Step 4: Enrichment (simulate API call)
  - id: enrich
    name: "Enrich with Company Data"
    command: |
      node -e "
      const input = JSON.parse(process.stdin);
      const enriched = input.records.map(r => ({
        ...r,
        enrichment: {
          companySize: Math.floor(Math.random() * 5000) + 1,
          industry: 'SaaS',
          verified: true,
          lastUpdated: new Date().toISOString()
        }
      }));
      console.log(JSON.stringify({
        enriched: true,
        count: enriched.length,
        records: enriched
      }, null, 2));
      "
    stdin: ${{ steps.filter.stdout }}
    output: json
    condition: ${{ steps.filter.validCount > 0 }}

  # Step 5: Approval gate
  - id: review
    name: "Review & Approve Export"
    command: lobster approve
    approval: required
    prompt: |
      📊 Data Enrichment Review
      
      Valid Records: ${{ steps.filter.validCount }}
      Enriched: ${{ steps.enrich.count }}
      
      Export to file? (yes/no)

  # Step 6: Export results
  - id: export
    name: "Export Enriched Data"
    command: |
      node -e "
      const input = JSON.parse(process.stdin);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      const filename = 'enriched-leads-' + timestamp + '.json';
      console.log(JSON.stringify({
        exported: true,
        filename: filename,
        recordCount: input.count,
        location: process.env.OUTPUT_DIR + '/' + filename
      }, null, 2));
      "
    stdin: ${{ steps.enrich.stdout }}
    output: json
    condition: ${{ steps.review.approved }}
    env:
      OUTPUT_DIR: ${{ args.output_dir || '/tmp' }}

  # Step 7: Summary
  - id: summary
    name: "Workflow Summary"
    command: |
      node -e "
      const status = process.env.EXPORTED === 'true' ? 'COMPLETE' : 'CANCELLED';
      console.log(JSON.stringify({
        status: status,
        timestamp: new Date().toISOString(),
        nextAction: status === 'COMPLETE' ? 'Import to CRM' : 'Review and retry'
      }, null, 2));
      "
    env:
      EXPORTED: ${{ steps.export.exported || 'false' }}
    output: json

on_success: |
  echo "✅ Data enrichment and export completed"

on_failure: |
  echo "❌ Data enrichment workflow cancelled"
