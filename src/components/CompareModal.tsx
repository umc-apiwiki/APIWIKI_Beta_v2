"use client";

import ModalBase from './ModalBase';
import { API } from '@/types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  apis: API[];
};

export default function CompareModal({ isOpen, onClose, apis }: Props) {
  const getPricingValue = (
    pricing: API['pricing'],
    tier: 'free' | 'basic' | 'pro' | 'csv'
  ) => {
    if (pricing && typeof pricing === 'object') {
      return pricing[tier];
    }
    return undefined;
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={`API 비교 (${apis.length})`}>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left">항목</th>
              {apis.map(a => (
                <th key={a.id} className="p-2 text-left">{a.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-2 font-semibold">평점</td>
              {apis.map(a => <td key={a.id} className="p-2">{a.rating}</td>)}
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">요금 - Free</td>
              {apis.map(a => {
                const price = getPricingValue(a.pricing, 'free');
                return <td key={a.id} className="p-2">{price ?? '-'}</td>;
              })}
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">요금 - Basic</td>
              {apis.map(a => {
                const price = getPricingValue(a.pricing, 'basic');
                return <td key={a.id} className="p-2">{price ?? '-'}</td>;
              })}
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">요금 - Pro</td>
              {apis.map(a => {
                const price = getPricingValue(a.pricing, 'pro');
                return <td key={a.id} className="p-2">{price ?? '-'}</td>;
              })}
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">인증 방식</td>
              {apis.map(a => <td key={a.id} className="p-2">{(a.authMethods || []).join(', ')}</td>)}
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">주요 기능</td>
              {apis.map(a => <td key={a.id} className="p-2">{(a.features || []).slice(0,3).join(', ')}</td>)}
            </tr>
            <tr className="border-t">
              <td className="p-2 font-semibold">문서 언어</td>
              {apis.map(a => <td key={a.id} className="p-2">{(a.docsLanguages || []).join(', ')}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </ModalBase>
  );
}
