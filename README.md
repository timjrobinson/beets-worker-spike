# Worker Scheduling Test

We want some workers that do the following:
- Process arbitrary jobs that take an arbitrary amount of time
- Run on a schedule
- The same job should never have 2 instances running

This is an attempt to do that without a scheduler - just some workers + Redis for coordination

## Usage

Installation:

```
npm i
docker run --name redis -d -p 6379:6379 redis
```

Running:

```
rm jobs.txt
npx tsx index.ts >> jobs.txt &
npx tsx index.ts >> jobs.txt &
npx tsx index.ts >> jobs.txt &
npx tsx index.ts >> jobs.txt &
npx tsx index.ts >> jobs.txt &
```

## Analyzing

Make sure there are no overlapping job id's. In vscode if you highlight the job id it's easy to see all instances of it, make sure every start is followed by a finished before the next start.

Jobs have a no progress reported timeout of I think 30 seconds, so if you kill all the workers and start again it may take up to 30 seconds for them to start processing again as they have to wait for all the previous runs to time out. 

