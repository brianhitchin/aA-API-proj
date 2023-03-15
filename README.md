# Welcome to MeetPup!
![welcome](https://user-images.githubusercontent.com/63670745/224509427-420412cb-df23-4725-b5d9-8f0f8150f530.png)
*(ReadMe v1.2, updated 3/15/2013)*

### Credits
This is made by Brian!
[github](https://github.com/brianhitchin)
[linkedIn](https://www.linkedin.com/in/brian-hitchin-940b57268/)
Background by talented LLY (I will link her site as soon as I find it. I lost it.) 

### What is MeetPup?
- A project to emulate [Meetup](https://www.meetup.com/).
- This is a project built on **express** backend and **react / redux** frontend.

### Some planned features
- Group CRUD
- Events CRUD
- RSVP
- Join Group
- Advanced search with queries
- Calendar for individual and all group pages
- AWS/S3 Image Upload
- Google Maps 

## How to get started
1. From the root, run install which will install both frontend and backend dependencies.

        npm run install

2. In the backend, reference .env.example and configure appropriately.
3. Run the appropriate migrations and seeders in the backend directory:

        npx dotenv sequelize db:migrate:all
        npx dotenv sequelize db:seed:all

4. Start both frontend and backend servers (on development, separately) with:

        npm run

## How to use MeetPup
Eventually, most of the functionalities implemented in MeetUp will be mirrored here as well. This includes creating events, groups, RSVP, etc...


Sign up through the sign-up button on the top right. 


![step1](https://user-images.githubusercontent.com/63670745/224509441-1a724a44-f437-42c2-9ccf-c2218d597183.png)


One can also access the webpage with full available functionalites with the demo user under login.


![step2](https://user-images.githubusercontent.com/63670745/224509446-05e93f25-5775-4156-b2f5-b673ed4bb2db.png)


Enjoy!
