import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/vue';
import { renderComponent } from '@/__tests__/unit/render';
import { Pagination } from '@/components/common';
import { registerIcons } from '@/utils/register-icons';

describe('Pagination component', () => {
  registerIcons();

  it('renders the pagination', () => {
    renderComponent(Pagination, { props: { page: 1, pageSize: 2, total: 6 } });

    expect(screen.getByRole('button', { name: /pagination prev/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pagination next/i })).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('click the next button and prev button', async () => {
    renderComponent(Pagination, { props: { page: 1, pageSize: 2, total: 6 } });

    expect(screen.getByText('1')).toHaveClass('active');
    await userEvent.click(screen.getByRole('button', { name: /pagination next/i }));
    expect(screen.getByText('1')).not.toHaveClass('active');
    expect(screen.getByText('2')).toHaveClass('active');
    await userEvent.click(screen.getByRole('button', { name: /pagination prev/i }));
    expect(screen.getByText('1')).toHaveClass('active');
    expect(screen.getByText('2')).not.toHaveClass('active');
  });

  it('click the page number', async () => {
    renderComponent(Pagination, { props: { page: 1, pageSize: 2, total: 6 } });

    expect(screen.getByText('1')).toHaveClass('active');
    await userEvent.click(screen.getByText('3'));
    expect(screen.getByText('3')).toHaveClass('active');
    expect(screen.getByText('1')).not.toHaveClass('active');
  });

  it('click the page number and emit changePage', async () => {
    const pageSize = 2;
    const { emitted } = renderComponent(Pagination, { props: { page: 1, pageSize, total: 6 } });

    await userEvent.click(screen.getByText('3'));
    expect(emitted('change')).toBeTruthy();
    expect(emitted('change')?.[0]).toEqual([3, pageSize]);
  });

  it('click the quick next and prev button', async () => {
    const pagerCount = 3;

    renderComponent(Pagination, { props: { page: 1, pageSize: 2, pagerCount, total: 20 } });

    await userEvent.click(screen.getByRole('listitem', { name: /next pages/i }));
    expect(screen.getByText(`${1 + pagerCount}`)).toHaveClass('active');
    await userEvent.click(screen.getByRole('listitem', { name: /prev pages/i }));
    expect(screen.getByText('1')).toHaveClass('active');
  });

  it('renders the correct status when total is 0', () => {
    renderComponent(Pagination, { props: { page: 1, pageSize: 2, total: 0 } });

    expect(screen.queryByRole('button', { name: /pagination prev/i })).toHaveAttribute('disabled');
    expect(screen.queryByRole('button', { name: /pagination next/i })).toHaveAttribute('disabled');
    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });

  it('renders the correct status when page is 1', () => {
    renderComponent(Pagination, { props: { page: 1, pageSize: 2, total: 10 } });

    expect(screen.queryByRole('button', { name: /pagination prev/i })).toHaveAttribute('disabled');
    expect(screen.queryByRole('button', { name: /pagination next/i })).not.toHaveAttribute('disabled');
  });

  it('renders the correct status when page is last page', () => {
    const page = 5;

    renderComponent(Pagination, { props: { page, pageSize: 2, total: 10 } });

    expect(screen.getByText(`${page}`)).toHaveClass('active');
    expect(screen.queryByRole('button', { name: /pagination prev/i })).not.toHaveAttribute('disabled');
    expect(screen.queryByRole('button', { name: /pagination next/i })).toHaveAttribute('disabled');
  });
});
