# BankFix API — Idea One-Pager

## Product idea
BankFix is a maintenance-request API for fictional multi-branch organisations.

## Target user
An operations administrator who oversees maintenance issues across multiple locations.

## Problem
The administrator lacks a consistent central record for tracking reported maintenance issues, assigned responsibility, and resolution status across locations.

## Proposed solution
A small API that records maintenance requests, associates them with a facility and optional asset, and supports status/priority tracking.

## Core Week 1 entity
`maintenance_requests`.

## Related entities
- `facilities`
- `assets`
- `work_assignments`

## Three-week scope
- Week 1: data model, PostgreSQL schema, maintenance-request CRUD, validation, examples and documentation.
- Week 2: authentication, authorization, ownership/role checks, stronger validation and error handling.
- Week 3: tests, security review, pagination/index review, deployment/local setup, walkthrough and reflection.

## Out of scope
Banking transactions, customer accounts, real branch addresses, real credentials, payment processing, file uploads, notifications, integrations, and complex SLA/approval workflows.

## Safety
Use fictional data only. Do not include actual banking details, customer information, passwords, tokens, or sensitive site-security details.

## Originality note
The problem is based on the author's observation. This document does not claim that no competing maintenance products exist.
