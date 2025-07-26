// types/components.ts
import { UserDistribution, PropertyType, CountrySale } from "./admin";

export interface AdminCardProps {
  label: string;
  value: number;
  percentage: string;
}

export interface TotalRevenueCardProps {
  totalRevenue: number;
}

export interface UserDistributionCardProps {
  userDistribution: UserDistribution[];
}

export interface PropertyTypesCardProps {
  propertyTypes: PropertyType[];
}

export interface SalesMappingCardProps {
  countrySales: CountrySale[];
}
