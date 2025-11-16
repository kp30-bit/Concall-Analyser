package middleware

import (
	"context"
	"log"
	"time"

	"concall-analyser/internal/service/analytics"

	"github.com/gin-gonic/gin"
)

// AnalyticsMiddleware creates middleware to track /api/list_concalls hits
func AnalyticsMiddleware(analyticsService analytics.AnalyticsService) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Continue with the request first
		c.Next()

		// Only track /api/list_concalls endpoint
		if c.Request.URL.Path == "/api/list_concalls" {
			// Check response status - skip tracking 304 (Not Modified) responses
			statusCode := c.Writer.Status()
			if statusCode == 304 {
				return
			}

			// Increment counter asynchronously to avoid blocking the request
			go func() {
				ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
				defer cancel()

				if err := analyticsService.IncrementTotalVisits(ctx); err != nil {
					log.Printf("Failed to increment total visits: %v", err)
				}
			}()
		}
	}
}
