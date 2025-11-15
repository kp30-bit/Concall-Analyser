package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AnnouncementResponse struct {
	Table  []Announcement `json:"Table"`
	Table1 []struct {
		ROWCNT int `json:"ROWCNT"`
	} `json:"Table1"`
}
type Announcement struct {
	NewsID           string  `json:"NEWSID"`
	ScripCode        int     `json:"SCRIP_CD"`
	XMLName          string  `json:"XML_NAME"`
	NewsSubject      string  `json:"NEWSSUB"`
	Datetime         string  `json:"DT_TM"`
	NewsDate         string  `json:"NEWS_DT"`
	NewsSubmission   string  `json:"News_submission_dt"`
	DisseminationDT  string  `json:"DissemDT"`
	CriticalNews     int     `json:"CRITICALNEWS"`
	AnnouncementType string  `json:"ANNOUNCEMENT_TYPE"`
	QuarterID        *string `json:"QUARTER_ID"`
	FileStatus       string  `json:"FILESTATUS"`
	AttachmentName   string  `json:"ATTACHMENTNAME"`
	More             string  `json:"MORE"`
	Headline         string  `json:"HEADLINE"`
	CategoryName     string  `json:"CATEGORYNAME"`
	Old              int     `json:"OLD"`
	RN               int     `json:"RN"`
	PDFFlag          int     `json:"PDFFLAG"`
	NSURL            string  `json:"NSURL"`
	ShortLongName    string  `json:"SLONGNAME"`
	AgendaID         int     `json:"AGENDA_ID"`
	TotalPageCount   int     `json:"TotalPageCnt"`
	TimeDiff         string  `json:"TimeDiff"`
	FileAttachSize   int64   `json:"Fld_Attachsize"`
	SubCategoryName  string  `json:"SUBCATNAME"`
	AudioVideoFile   *string `json:"AUDIO_VIDEO_FILE"`
}

// ConcallSummary represents the processed concall data to be stored in MongoDB
type ConcallSummary struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name      string             `bson:"name" json:"name"`
	Date      string             `bson:"date" json:"date"`
	Guidance  string             `bson:"guidance" json:"guidance"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}

type ConcallLite struct {
	Name     string `bson:"name" json:"name"`
	Date     string `bson:"date" json:"date"`
	Guidance string `bson:"guidance" json:"guidance"`
}
