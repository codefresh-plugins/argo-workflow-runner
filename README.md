#Argo workflow runner
Use Argo workflow runner plugin to run argo workflows from codefresh pipeline

Usage
Set required and optional environment variable and add the following step to your Codefresh pipeline:

```
  run-workflow:
    title: Run argo workflow
    type: argo-workflow-runner
    arguments:
      namespace: argo
      argo_host: 'argo-server.argo:2746'
      workflow: |
        workflow:
          metadata:
            generateName: step-
          spec:
            entrypoint: argosay
            arguments:
              parameters:
                - name: message
                  value: hello argo
            templates:
              - name: argosay
                inputs:
                  parameters:
                    - name: message
                      value: '{{workflow.parameters.message}}'
                container:
                  name: main
                  image: 'argoproj/argosay:v2'
                  command:
                    - /argosay
                  args:
                    - echo
                    - '{{inputs.parameters.message}}'
```
Environment Variables
| Variables    | Required | Default | Description |
| ---------    | -------- | ------- | ----------- |
| namespace    | NO       |	argo	| Argo workflow namespace |
| argo_host    | YES      |	        | Argo workflow host |
| workflow     | YES      |	        | Argo workflow spec https://argoproj.github.io/argo-workflows/fields/ |
