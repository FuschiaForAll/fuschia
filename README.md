# Fuchsia

Fuchsia is the first Open-Sourced No-Code platform.

## Monorepo

The monolithic repo consists of all the parts required to run your own no-code platform, as well as deploy your apps and sites.

### backend-builder

The backend builder is the server component for the no-code platform.

### backend-runner

The backend runner is the deployed apps backend server. Every app deployed is a single-tenant server with an exposed graphql API for your app and third party software to interact with

### component-primitives

There are no baked in components for the no-code builder. This is the starter package for components with items like Screens, Buttons, Textboxes, and Inputs.

### frontend-builder

This is the No-Code interface that communicates with the backend-builder to design your apps

### package-manager

This is where components will live. Components get deployed to the package-manager for use in the apps.

### types

As this is a mono-repo, types is where all common code will be stored
