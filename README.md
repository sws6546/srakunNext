# Srakunpl 2
## technologies: `Next.js (typescript)`, `prisma (sqlite)`, `auth0`

* Add file `.env.local`, and put into it:
```
AUTH0_SECRET=''
AUTH0_BASE_URL=''
AUTH0_ISSUER_BASE_URL=''
AUTH0_CLIENT_ID=''
AUTH0_CLIENT_SECRET=''
```

* Add file `.env`, and put into it:
```
DATABASE_URL="file:./dev.db"
```

* make database using prisma dosc `https://www.prisma.io/`

* Type `npm run build` and `npm run start`