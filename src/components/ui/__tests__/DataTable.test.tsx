import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DataTable } from '../DataTable';

describe('DataTable Component', () => {
  const mockColumns = [
    { header: 'ID', accessor: (item: any) => `#${item.id}` },
    { header: 'Name', accessor: 'name' } as any,
  ];

  const mockData = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ];

  it('renders data correctly', () => {
    render(
      <DataTable 
        columns={mockColumns} 
        data={mockData} 
        isSucceeded={true}
      />
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
  });

  it('shows loading message when isLoading is true', () => {
    render(
      <DataTable 
        columns={mockColumns} 
        data={[]} 
        isLoading={true} 
        loadingMessage="Testing Loading..."
      />
    );

    expect(screen.getByText('Testing Loading...')).toBeInTheDocument();
  });

  it('shows empty message when data is empty and status is succeeded', () => {
    render(
      <DataTable 
        columns={mockColumns} 
        data={[]} 
        isSucceeded={true} 
        emptyMessage="No items found"
      />
    );

    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('handles row clicks', () => {
    const onRowClick = vi.fn();
    render(
      <DataTable 
        columns={mockColumns} 
        data={mockData} 
        onRowClick={onRowClick} 
      />
    );

    fireEvent.click(screen.getByText('Item 1'));
    expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  it('renders pagination and handles page changes', () => {
    const onPageChange = vi.fn();
    render(
      <DataTable 
        columns={mockColumns} 
        data={mockData} 
        pagination={{
          page: 1,
          totalPages: 5,
          onPageChange: onPageChange
        }} 
      />
    );

    expect(screen.getByText((_, element) => {
      const hasText = (node: Element | null): boolean => 
        node?.textContent === 'Showing page 1 of 5' || 
        node?.textContent?.replace(/\s+/g, ' ').trim() === 'Showing page 1 of 5' ||
        (!!node?.textContent?.includes('Showing page') && !!node?.textContent?.includes('1') && !!node?.textContent?.includes('5'));
      
      const elementHasText = hasText(element);
      const childrenDontHaveText = Array.from(element?.children || []).every(
        child => !hasText(child as Element)
      );
      
      return !!(elementHasText && childrenDontHaveText);
    })).toBeInTheDocument();
    
    // Let's click the page "2" button which should be present.
    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);
    
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
