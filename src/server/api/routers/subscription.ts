import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { getUserSubscription } from '~/lib/subscription';

export const subscriptionRouter = createTRPCRouter({
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    return await getUserSubscription(ctx.session.user.id);
  }),

  getUsage: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await getUserSubscription(ctx.session.user.id);
    
    // Get current usage
    const portfolioCount = await ctx.db.portfolio.count({
      where: { userId: ctx.session.user.id },
    });

    const positionCount = await ctx.db.position.count({
      where: {
        portfolio: {
          userId: ctx.session.user.id,
        },
      },
    });

    return {
      subscription,
      usage: {
        portfolios: portfolioCount,
        positions: positionCount,
      },
    };
  }),

  checkFeatureAccess: protectedProcedure
    .input(z.object({
      feature: z.enum(['portfolios', 'positions', 'advancedAnalytics', 'exportData', 'prioritySupport']),
    }))
    .query(async ({ ctx, input }) => {
      const subscription = await getUserSubscription(ctx.session.user.id);
      const plan = subscription.limits;
      
      const limit = plan[input.feature];
      
      if (typeof limit === 'boolean') {
        return { hasAccess: limit };
      }
      
      // For numeric limits, we'd need to check actual usage
      // This is a simplified version
      return { hasAccess: limit > 0 };
    }),
});
