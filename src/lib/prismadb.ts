import { PrismaClient } from '@prisma/client'

interface GlobalWithPrismaDB {
  primsadb?: PrismaClient
}

const globalWithPrismaDB = global as GlobalWithPrismaDB

const client = globalWithPrismaDB.primsadb || new PrismaClient()

if (process.env.NODE_ENV === 'development') {
  globalWithPrismaDB.primsadb = client
}

export default client
