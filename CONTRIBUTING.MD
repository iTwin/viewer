# Contributing

Thank you for your interest in contributing! There are several ways you can help.

Please take a read through this document to help streamline the process of getting your contributions added.

## Table of Contents

- [Adding a New Project](#adding-a-new-project)
- [Creating Issues and Enhancements](#creating-issues-and-enhancements)
  - [Writing Good Bug Reports and Feature Requests](#writing-good-bug-reports-and-feature-requests)
- [Pull Requests](#pull-requests)

## Adding a New Project

A Project is defined as a self-contained piece of functionality. Each new project is in a sub-folder of the `./packages/modules` or `./packages/apps` folder in this repository, depending on the type of project. The name of the folder should share a similar name of the package that will be published and should contain the source code for that project.

Because each Project is self-contained, it is necessary for the contributor of the Project to specify a contact for PRs and bug reports. To do this, add an entry to the CODEOWNERS file in the root directory of the repository, e.g.:

    # Clara Developer owns the new extension snippet
    /packages/modules/imodel-select  @clara.developer

Remember that the last entry for a matching directory or file name pattern takes precedence over any earlier entries.

### Naming conventions

- All names should be hyphenated lower case (e.g., imodel-select).

## Creating Issues and Enhancements

Have you identified a reproducible problem in this code? Have a feature requests? Please create an Issue, but first make sure that you search the work items to make sure that it has not been entered yet. If you find your issue already exists, please add relevant comments or just a thumbs up to let us know that more people face this issue.

### Writing Good Bug Reports and Feature Requests

File a single issue per problem and feature request. Do not enumerate multiple bugs or feature requests in the same issue.

Do not add your issue as a comment to an existing issue unless it's for the identical input. Many issues look similar, but have different causes.

The more information you can provide, the more likely someone will be successful at reproducing the issue and finding a fix.

Please include the following with each issue:

- Version of the package
- Your operating system
- Reproducible steps (1... 2... 3...) that cause the issue
- What you expected to see, versus what you actually saw
- Images, animations, or a link to a video showing the issue occurring
- A code snippet that demonstrates the issue or a link to a code repository the developers can easily pull down to recreate the issue locally

## Pull Requests

We follow the normal [GitHub pull request workflow](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request) to ensure that all code changes in this repository are code reviewed and all tests pass. This means that there will be a number of reviewers that formally review and sign off for changes. Reviewers should check for redundancy, optimization, stylization, and standardization in each changeset. While we will try to keep this repository as collaborative and open-source as possible, it must also be reliable.

Every change must be tested with proper unit tests. Integration tests are highly encouraged in libraries with critical workflows to ensure end-to-end consistency.

Every change must be described with a change log: Run `rush change` on your committed and choose the appropriate change type. Commit your change log along with your pull request.

### Code Change Workflow

1. Make source code changes on a new Git branch.
2. Add unit tests.
3. Ensure unit tests pass when run locally: `rush test`.
4. Test changes with the appropriate development app for your changes (web-viewer-test, desktop-viewer-test).
   - From root directory - `rushx build` (alternatively, run `rushx start`in each project folder that you are editing as well as the development app folder to watch for changes and re-compile).
   - From packages\apps\web-viewer-test - `rushx start`.
   - Make changes to web-viewer-test, if necessary.
   - Test changes.
   - Do not check in changes to web-viewer-test to source control.
5. Commit your changes.
6. Add a changelog entry (which could potentially cover several commits): `rush change`.
7. Follow prompts to enter a change description or press ENTER if the change does not warrant a changelog entry. If multiple packages have changed, multiple sets of prompts will be presented.
8. Completing the `rush change` prompts will cause new changelog entry JSON files to be created.
9. Commit the changelog JSON files.
10. Publish changes to the branch and open a pull request.
