package middleware

import (
	"context"
	"log"
	"time"

	"concall-analyser/internal/service/analytics"

	"github.com/gin-gonic/gin"
)

func AnalyticsMiddleware(analyticsService analytics.AnalyticsService) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if c.Request.URL.Path == "/api/list_concalls" {
			statusCode := c.Writer.Status()
			if statusCode == 304 {
				return
			}

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
