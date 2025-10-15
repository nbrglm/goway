export const handlerTemplateString = `package {packageName}

import (
  "net/http"
  "github.com/gin-gonic/gin"
  "github.com/google/uuid"
  "github.com/prometheus/client_golang/prometheus"
  "{baseImportPath}/internal/obs"
  "{baseImportPath}/internal/metrics"
  "{baseImportPath}/internal/store"
  "{baseImportPath}/internal/reserr"
  "{baseImportPath}/internal/resp"
  "{baseImportPath}/utils"
)

type {HandlerName}Handler struct {
  {HandlerName}Counter *prometheus.CounterVec
}

func New{HandlerName}Handler() *{HandlerName}Handler {
  return &{HandlerName}Handler{
    {HandlerName}Counter: prometheus.NewCounterVec(
      prometheus.CounterOpts{
        Namespace: "{metricsNamespace}",
        Subsystem: "changeMe", // TODO: Update this to a meaningful subsystem name
        Name:      "{handler_name}",
        Help:      "Total number of {HandlerName} requests",
      }, []string{"status"},
    ),
  }
}

func (h *{HandlerName}Handler) Register(router *gin.Engine) {
  metrics.RegisterCollector(h.{HandlerName}Counter)
  router.{routeMethodUpper}("{routePath}", h.Handle)
}

type {HandlerName}Request struct {
  // TODO: Define the request structure
}

type {HandlerName}Response struct {
  resp.BaseResponse
  // TODO: Define the response structure
}

// @Summary {HandlerName} Endpoint
// @Description Handles {HandlerName} requests
// TODO: Update the tags and responses as needed
// @Tags subsystem
// @Accept json
// @Produce json
// @Param request body {HandlerName}Request true "Request body"
// @Success 200 {object} {HandlerName}Response
// @Failure 400 {object} reserr.ErrorResponse
// @Failure 401 {object} reserr.ErrorResponse
// @Failure 500 {object} reserr.ErrorResponse
// @Router {routePath} [{routeMethodLower}]
func (h *{HandlerName}Handler) Handle(c *gin.Context) {
  h.{HandlerName}Counter.WithLabelValues("total").Inc()

  ctx, log, span := obs.WithContext(c.Request.Context(), "{HandlerName}Handler.Handle")
  defer span.End() // Ensure the span is ended when the function returns to prevent memory leaks

  var req {HandlerName}Request
  if err := c.ShouldBindJSON(&req); err != nil {
    reserr.ProcessError(c, reserr.BadRequest(), span, log, h.{HandlerName}Counter, "{HandlerName}Handler.Handle")
    return
  }
  
  tx, err := store.PgPool.Begin(ctx)
  if err != nil {
    reserr.ProcessError(c, reserr.InternalServerError(err, "Failed to begin transaction"), span, log, h.{HandlerName}Counter, "{HandlerName}Handler.Handle")
    return
  }
  defer tx.Rollback(ctx)

  // TODO: Implementation of the {HandlerName} logic goes here.

  if err := tx.Commit(ctx); err != nil {
    reserr.ProcessError(c, reserr.InternalServerError(err, "Failed to commit transaction"), span, log, h.{HandlerName}Counter, "{HandlerName}Handler.Handle")
    return
  }
  
  h.{HandlerName}Counter.WithLabelValues("success").Inc()
  c.JSON(http.StatusOK, {HandlerName}Response{
    BaseResponse: resp.BaseResponse{
      Success: true,
      Message: "Operation {HandlerName} completed successfully.",
    },
  })
}`;