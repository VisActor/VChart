# Contributing

## Code of Conduct

We has adopted [the Contributor Covenant](CODE_OF_CONDUCT.md) as our Code of Conduct, and we expect project participants to adhere to it. Please read the full text so that you can understand what actions will and will not be tolerated.

## Open Development

All work on VChart happens directly on GitHub. Both core team members and external contributors send pull requests which go through the same review process.

## Semantic Versioning

VChart follows [semantic versioning](https://semver.org/). We release patch versions for critical bugfixes, minor versions for new features or non-essential changes, and major versions for any breaking changes. When we make breaking changes, we also introduce deprecation warnings in a minor version so that our users learn about the upcoming changes and migrate their code in advance.

Every significant change is documented in the changelog file.

## Branch Organization

Submit all changes directly to the develop branch. The main branch represents the latest production version of the project. We do our best to keep the main and develop branch in good shape, with all tests passing.

Code that lands in main must be compatible with the latest stable release. It may contain additional features, but no breaking changes. We should be able to release a new minor version from the tip of main at any time.

## Bugs

We are using [GitHub Issues](https://github.com/VisActor/VChart/issues) for our public bugs. We keep a close eye on this and try to make it clear when we have an internal fix in progress. Before filing a new task, try to make sure your problem doesn’t already exist.

We have already prepared issue templates for bug reports and feature requests. If you want to fire an issue, just enter the [New issue](https://github.com/VisActor/VChart/issues/new/choose) page and select either of them to get started. The best way to get your bug fixed is by using our issue template and provide reproduction steps with this [template](https://github.com/VisActor/VChart/issues/new?assignees=&labels=bug&projects=&template=bug_report.yml&title=%5BBug%5D+).

## Proposing a Change

If you intend to change the public API, or make any non-trivial changes to the implementation, we recommend filing an issue, or just enter the [New issue](https://github.com/VisActor/VChart/issues/new/choose) page and select either of them to get started.

If you’re only fixing a bug, it’s fine to submit a pull request right away but we still recommend to file an issue detailing what you’re fixing. This is helpful in case we don’t accept that specific fix but want to keep track of the issue.

## Your First Pull Request

Working on your first Pull Request? You can learn how from this free video series:[How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

To help you get your feet wet and get you familiar with our contribution process, we have a list of [good first issues](https://github.com/VisActor/VChart/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) that contain bugs that have a relatively limited scope. This is a great place to get started.

If you decide to fix an issue, please be sure to check the comment thread in case somebody is already working on a fix. If nobody is working on it at the moment, please leave a comment stating that you intend to work on it so other people don’t accidentally duplicate your effort.

If somebody claims an issue but doesn’t follow up for more than two weeks, it’s fine to take it over but you should still leave a comment.

### Sending a Pull Request

The core team is monitoring for pull requests. We will review your pull request and either merge it, request changes to it, or close it with an explanation. We’ll do our best to provide updates and feedback throughout the process.

**Before submitting a pull request**, please make sure the following is done:

1. Fork the [repository](git@github.com:VisActor/VChart.git) and create your branch from `develop`.
2. (If rush has been install, just go to step 3) global install [@microsoft/rush](https://rushjs.io/pages/intro/get_started/)：`npm i --global @microsoft/rush`.
3. Run `rush update` in the repository root.
4. If you’ve fixed a bug or added code that should be tested, add tests!
5. Ensure the test suite passes (`rush test`).
6. If you've modified sources code(The code in `src/` folder), make sure you've run `rush change`, and commit the rush changelog in `common/changes`.
7. Run `rush compile` for typescript check. Tip: we will also do this check in github workflow.

## Development Workflow

After cloning VChart, run `rush update` to fetch its dependencies. Then, you can run several commands:

1. `rush start` runs VChart test page locally.
2. `rush react` runs React VChart test page locally.
3. `rush eslint` checks the code style.
4. `rush test` runs the complete test suite.
5. `rush run -p <project_name> -s <script>` run the specified script for the specified project, eg. `rush run -p @visactor/vchart -s start`
6. `rush prettier --dir <project_relative_path> --ext <file_type>` prettier the specified script for the specified project, eg. `rush prettier --dir packages/vchart --ext ts`

If you want to update documents, you can run `rush docs` to preview VChart document contents locally.
