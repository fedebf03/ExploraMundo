export interface EmptyStateOptions {
  icon?: string;
  title: string;
  description?: string;
  actionHref?: string;
  actionText?: string;
}

export function renderEmptyState(options: EmptyStateOptions): string {

  const iconHtml = options.icon ? `<div class="empty-state__icon">${options.icon}</div>` : '';
  const descHtml = options.description ? `<p class="empty-state__desc">${options.description}</p>` : '';
  const actionHtml = options.actionHref && options.actionText
    ? `<a href="${options.actionHref}" class="btn btn-primary">${options.actionText}</a>`
    : '';

  return `
    <div class="empty-state">
      ${iconHtml}
      <h3 class="empty-state__title">${options.title}</h3>
      ${descHtml}
      ${actionHtml}
    </div>
  `;

}
