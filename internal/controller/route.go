package controller

import (
	"concall-analyser/internal/interfaces"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, u interfaces.Usecase) {

	r.GET("/fetchConcallData", u.FetchConcallDataHandler)
}
