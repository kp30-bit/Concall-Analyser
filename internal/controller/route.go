package controller

import (
	"concall-analyser/internal/interfaces"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, u interfaces.Usecase) {

	r.GET("/fetch_concalls", u.FetchConcallDataHandler)
	r.GET("/list_concalls", u.ListConcallHandler)
	r.GET("/find_concalls", u.FindConcallHandler)
}
