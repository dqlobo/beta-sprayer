# BetaSprayer

_This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)._

Running locally:

1. Install Node v21.5.0 (I just used NVM for this: `nvm install node`)
2. Set up databases
   - _Fair warning: Since this was a fast turnaround project I didn't spend much time on devops best practices_
   - For development I used the production databases and object storage. Vercel made it too easy. You can set up a vercel account [here](https://vercel.com/docs/getting-started-with-vercel)
   - Then add [blob storage](https://vercel.com/docs/storage/vercel-blob/quickstart) and [database storage](https://vercel.com/docs/storage/vercel-postgres/quickstart). 
   - You can keep your environment in sync really easily with the `vercel env pull` command
3. Add a `ROBOFLOW_API_KEY` to your environment for [this model](https://universe.roboflow.com/loboflow-go1lj/climbing-replica-test/model/1)
4. Run `npm run dev`

## Context

Some climbers refer to a route as a "problem" because the different moves you make are pieces to the puzzle that allow you to get to the top. Contrary to popular belief, strength is often not the most important component of climbing successfully, _problem solving is_!

The best climbers know how to "read" a route and pick out exactly which holds to use at what time. It can be frustrating if someone spoils the "beta" (the solution to the route), **so much so that the slang term "Beta sprayer" has become very popular** in climbing circles. When prompted, however, getting climbing beta can help you develop as a climber. Learning by doing!

**This project is the MVP for a tool that harnesses a Roboflow AI model to recognize indoor climbing holds.**

## Further Enhancements

There are a million ways I'd love to build on this project, but to name a few:

#### Features

- **User-generated labels and Active Learning**

  Build a feedback loop with the Roboflow API to continue improving BetaSprayer through the use of user-generated labels. As a followup, incorperate a pipeline for Active Learning for holds with low confidence thresholds.

- **Color auto-routing**

  Climbing routes are color coordinated, we should be able to sense within the bounding box to auto-find a route pretty easily.

- **Route auto-solving**

  Given a climber's height and skill level, if you can identify the exact manufactured hold (As I demonstrated is possible in [another Roboflow model)](https://universe.roboflow.com/loboflow-go1lj/climbing-wall) and combine the hold type with rotation and relative position to other holds, a computer algorithm could feasibly solve the route. This was my initial inspiration for this project.

- **View route moves as animated sequence**

- Others: User authentication, beta ownership, route geotagging, enterprise users (Catalog all the routes at your gym for new climbers)

#### Tech debt

- Better data modeling of moves and recognized holds
- In the middle of design system change to Ant Design... went down the wrong path with https://www.flowbite-react.com/ - there were some really difficult bindings with Tailwind that were really challenging to work with
- Polling/Socket streaming when hitting external API

# Credits
A handful of great blogposts really accelerated my progress with this project. They are tracked in credits.txt.
