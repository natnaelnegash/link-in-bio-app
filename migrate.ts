import { BlockType, PrismaClient } from "@/generated/prisma";

const prisma  = new PrismaClient()

async function main() {
    
    console.log('Starting primsa migration')

    const oldLinks = await prisma.block.findMany({
        where: {type: null}
    })

    console.log(`Found ${oldLinks.length} records to migrate`);
    
    for (const link in oldLinks) {
        const oldData = link as any

        if (oldData.title && oldData.url) {
            await prisma.block.update({
                where: {id: link?.id},
                data: {
                    type: BlockType.LINK,
                    properties: {
                        title: oldData.title,
                        url: oldData.url,
                    }
                }
            })
            console.log(`Migrated block ${link?.id}`);
        }
    }
}

main().catch((e) => {
        console.error(e)
        process.exit(1)
    }
    ).finally(async () => await prisma.$disconnect())