package mongo

import (
	"context"
	"fmt"

	"concall-analyser/internal/db"
	"concall-analyser/internal/domain"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	analyticsDocID = "analytics_counter"
)

type analyticsRepository struct {
	coll *mongo.Collection
}

// NewAnalyticsRepository creates a new MongoDB implementation of AnalyticsRepository
func NewAnalyticsRepository(db *db.MongoDB) domain.AnalyticsRepository {
	return &analyticsRepository{
		coll: db.Collection("analytics"),
	}
}

// IncrementTotalVisits increments the total visits counter
func (r *analyticsRepository) IncrementTotalVisits(ctx context.Context) error {
	filter := bson.M{"_id": analyticsDocID}
	update := bson.M{
		"$inc":         bson.M{"total_visits": 1},
		"$setOnInsert": bson.M{"_id": analyticsDocID},
	}

	opts := options.Update().SetUpsert(true)
	_, err := r.coll.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return fmt.Errorf("failed to increment total visits: %w", err)
	}

	return nil
}

// GetTotalVisits returns the total visits count
func (r *analyticsRepository) GetTotalVisits(ctx context.Context) (int64, error) {
	filter := bson.M{"_id": analyticsDocID}

	var result struct {
		TotalVisits int64 `bson:"total_visits"`
	}

	err := r.coll.FindOne(ctx, filter).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			// Document doesn't exist yet, return 0
			return 0, nil
		}
		return 0, fmt.Errorf("failed to get total visits: %w", err)
	}

	return result.TotalVisits, nil
}
