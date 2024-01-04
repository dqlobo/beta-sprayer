# BetaSprayer

_This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)._

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

## Getting Started with NextJS (Stock README)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
