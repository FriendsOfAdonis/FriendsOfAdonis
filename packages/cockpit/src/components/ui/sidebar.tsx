import { ComponentProps } from '@foadonis/spark/jsx'
import { cn } from '../../utils/cn.js'
import { Link } from '@foadonis/spark'
import { BaseResource } from '../../resources/base.js'
import { HttpContext } from '@adonisjs/core/http'

export const Sidebar = ({ className, ...props }: ComponentProps<'nav'>) => (
  <nav className={cn('w-[250px] bg-base-300')} {...props} />
)

Sidebar.Header = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('px-4', className)} {...props} />
)

Sidebar.Content = ({ ...props }: ComponentProps<'ul'>) => <div {...props} />

Sidebar.Group = ({ ...props }: ComponentProps<'li'>) => <ul className="menu w-full" {...props} />

Sidebar.GroupLabel = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('menu-title', className)} {...props} />
)

Sidebar.Menu = ({ ...props }: ComponentProps<'ul'>) => <ul {...props} />

Sidebar.MenuItem = ({ className, ...props }: ComponentProps<'li'>) => (
  <li className={className} {...props} />
)

Sidebar.Link = ({
  pathMatch = 'exact',
  href,
  ...props
}: ComponentProps<typeof Link> & { pathMatch?: 'prefix' | 'exact' }) => {
  const ctx = HttpContext.getOrFail()
  const current = ctx.request.url()
  const isActive = href
    ? pathMatch === 'exact'
      ? current === href
      : current.startsWith(href)
    : false

  return (
    <Link
      href={href}
      className={cn({
        'menu-active': isActive,
      })}
      {...props}
    />
  )
}

Sidebar.ResourceLink = ({
  resource,
  ...props
}: ComponentProps<typeof Link> & { resource: BaseResource }) => {
  return (
    <Sidebar.Link href={`/admin/resources/${resource.name}`} pathMatch="prefix" {...props}>
      <resource.icon className="size-5" />
      {resource.labelPlural}
    </Sidebar.Link>
  )
}
