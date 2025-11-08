package interfaces

import (
	"github.com/gin-gonic/gin"
)

type Usecase interface {
	FetchConcallDataHandler(c *gin.Context)
}
