package controller

import (
	"concall-analyser/internal/interfaces"
	"concall-analyser/internal/middleware"
	"concall-analyser/internal/service/analytics"
	ws "concall-analyser/internal/websocket"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func RegisterRoutes(r *gin.Engine, u interfaces.Usecase, analyticsService analytics.AnalyticsService, hub *ws.Hub) {
	r.Use(middleware.AnalyticsMiddleware(analyticsService))

	// Simple health check endpoint that does not touch the database.
	// Useful for uptime pings (e.g., keeping Render free-tier dynos warm).
	r.GET("/healthz", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
		})
	})

	r.GET("/ws/analytics", func(c *gin.Context) {
		conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to upgrade connection"})
			return
		}
		ws.ServeWs(hub, conn)
	})

	api := r.Group("/api")
	{
		api.GET("/fetch_concalls", u.FetchConcallDataHandler)
		api.GET("/list_concalls", u.ListConcallHandler)
		api.GET("/find_concalls", u.FindConcallHandler)
		api.DELETE("/cleanup_concalls", u.CleanupConcallHandler)
		api.GET("/analytics", u.GetAnalyticsHandler)
	}
}
