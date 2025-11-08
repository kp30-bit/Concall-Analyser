package usecase

import (
	"concall-analyser/config"
	"concall-analyser/internal/db"
	"concall-analyser/internal/interfaces"

	"github.com/gin-gonic/gin"
)

type usecase struct {
	db  *db.MongoDB
	cfg *config.Config
}

func NewUsecase(db *db.MongoDB, cfg *config.Config) interfaces.Usecase {
	return &usecase{db: db, cfg: cfg}
}

func (u *usecase) FetchConcallDataHandler(c *gin.Context) {
	// TODO: Implement FetchConcallData
}
