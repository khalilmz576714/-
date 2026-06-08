import React, { useState, useEffect } from 'react';
import type { Entry, EntryInput, IceLevel, SugarLevel, CupSize } from '../../types';
import { ICE_LABELS, SUGAR_LABELS, CUP_SIZE_LABELS } from '../../types';
import PhotoUploader from './PhotoUploader';
import DatePicker from './DatePicker';
import StarRating from '../ui/StarRating';

interface Props {
  initial?: Entry | null;
  onSave: (data: EntryInput) => Promise<void>;
  onUpdate?: (id: string, data: Partial<EntryInput>) => Promise<void>;
  onClose: () => void;
}

const DEFAULT_ICE: IceLevel = 'normal-ice';
const DEFAULT_SUGAR: SugarLevel = 'half-sugar';

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function EntryForm({ initial, onSave, onUpdate, onClose }: Props) {
  const isEditing = !!initial;
  const [name, setName] = useState(initial?.name || '');
  const [shop, setShop] = useState(initial?.shop || '');
  const [price, setPrice] = useState(initial ? String(initial.price) : '');
  const [image, setImage] = useState<string | null>(initial?.image || null);
  const [iceLevel, setIceLevel] = useState<IceLevel>(initial?.iceLevel || DEFAULT_ICE);
  const [sugarLevel, setSugarLevel] = useState<SugarLevel>(initial?.sugarLevel || DEFAULT_SUGAR);
  const [cupSize, setCupSize] = useState<CupSize | null>(initial?.cupSize || null);
  const [rating, setRating] = useState(initial?.rating || 3);
  const [review, setReview] = useState(initial?.review || '');
  const [drunkAt, setDrunkAt] = useState(initial?.drunkAt?.slice(0, 10) || todayStr());
  const [isFavorite, setIsFavorite] = useState(initial?.isFavorite || false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setShop(initial.shop);
      setPrice(String(initial.price));
      setImage(initial.image);
      setIceLevel(initial.iceLevel);
      setSugarLevel(initial.sugarLevel);
      setCupSize(initial.cupSize);
      setRating(initial.rating);
      setReview(initial.review);
      setDrunkAt(initial.drunkAt.slice(0, 10));
      setIsFavorite(initial.isFavorite);
    }
  }, [initial]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = '请输入奶茶名称';
    const p = parseFloat(price);
    if (isNaN(p) || p <= 0) errs.price = '请输入有效价格';
    if (p > 9999) errs.price = '价格不能超过9999';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    const data: EntryInput = {
      name: name.trim(),
      shop: shop.trim(),
      price: parseFloat(parseFloat(price).toFixed(2)),
      image,
      iceLevel,
      sugarLevel,
      cupSize,
      rating,
      review: review.trim(),
      isFavorite,
      drunkAt: drunkAt + 'T12:00:00.000Z',
    };
    try {
      if (isEditing && onUpdate && initial) {
        await onUpdate(initial.id, data);
      } else {
        await onSave(data);
      }
      onClose();
    } catch {
      setErrors({ submit: '保存失败，请重试' });
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    backgroundColor: 'var(--color-card)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text)',
  };

  return (
    <div className="px-5 py-6 pb-safe space-y-6 max-w-lg mx-auto">
      {/* Photo */}
      <PhotoUploader currentImage={image} onImageChange={setImage} />

      {/* Name */}
      <div>
        <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-muted)' }}>名称 *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例：黑糖珍珠鲜奶"
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={inputStyle}
        />
        {errors.name && <div className="text-xs mt-1" style={{ color: '#e8505b' }}>{errors.name}</div>}
      </div>

      {/* Shop + Price row */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-muted)' }}>店铺</label>
          <input
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            placeholder="例：喜茶"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={inputStyle}
          />
        </div>
        <div className="w-28">
          <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-muted)' }}>价格 *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--color-muted)' }}>¥</span>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="0"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              className="w-full pl-7 pr-3 py-3 rounded-xl text-sm outline-none"
              style={inputStyle}
            />
          </div>
          {errors.price && <div className="text-xs mt-1" style={{ color: '#e8505b' }}>{errors.price}</div>}
        </div>
      </div>

      {/* Ice Level */}
      <div>
        <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-muted)' }}>冰量</label>
        <div className="flex gap-2">
          {(Object.keys(ICE_LABELS) as IceLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setIceLevel(level)}
              className="flex-1 py-2.5 rounded-pill text-xs font-medium transition-all"
              style={{
                backgroundColor: iceLevel === level ? 'var(--color-selected-bg)' : 'var(--color-card)',
                color: iceLevel === level ? 'var(--color-selected-text)' : 'var(--color-text)',
                border: iceLevel === level ? 'none' : '1px solid var(--color-border)',
              }}
            >
              {ICE_LABELS[level]}
            </button>
          ))}
        </div>
      </div>

      {/* Sugar Level */}
      <div>
        <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-muted)' }}>糖度</label>
        <div className="flex gap-2">
          {(Object.keys(SUGAR_LABELS) as SugarLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setSugarLevel(level)}
              className="flex-1 py-2.5 rounded-pill text-xs font-medium transition-all"
              style={{
                backgroundColor: sugarLevel === level ? 'var(--color-selected-bg)' : 'var(--color-card)',
                color: sugarLevel === level ? 'var(--color-selected-text)' : 'var(--color-text)',
                border: sugarLevel === level ? 'none' : '1px solid var(--color-border)',
              }}
            >
              {SUGAR_LABELS[level]}
            </button>
          ))}
        </div>
      </div>

      {/* Cup Size (optional) */}
      <div>
        <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-muted)' }}>杯型（选填）</label>
        <div className="flex gap-2">
          {([null, ...Object.keys(CUP_SIZE_LABELS)] as (CupSize | null)[]).map((size) => (
            <button
              key={size || 'none'}
              onClick={() => setCupSize(size)}
              className="flex-1 py-2.5 rounded-pill text-xs font-medium transition-all"
              style={{
                backgroundColor: cupSize === size ? 'var(--color-selected-bg)' : 'var(--color-card)',
                color: cupSize === size ? 'var(--color-selected-text)' : 'var(--color-text)',
                border: cupSize === size ? 'none' : '1px solid var(--color-border)',
              }}
            >
              {size ? CUP_SIZE_LABELS[size] : '不限'}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-muted)' }}>评分</label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      {/* Review */}
      <div>
        <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-muted)' }}>评价</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="这杯奶茶好喝吗？口感怎么样？"
          rows={3}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
          style={inputStyle}
        />
      </div>

      {/* Date */}
      <DatePicker value={drunkAt} onChange={setDrunkAt} />

      {/* Favorite toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm" style={{ color: 'var(--color-text)' }}>收藏</span>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="text-2xl transition-transform active:scale-125"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Error */}
      {errors.submit && (
        <div className="text-sm text-center py-2 rounded-xl" style={{ color: '#e8505b', backgroundColor: '#fff5f5' }}>
          {errors.submit}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full py-4 rounded-2xl text-base font-medium transition-opacity disabled:opacity-50"
        style={{ backgroundColor: 'var(--color-selected-bg)', color: 'var(--color-selected-text)' }}
      >
        {saving ? '保存中...' : isEditing ? '更新记录' : '保存记录'}
      </button>

      {/* Spacer for bottom */}
      <div className="h-4" />
    </div>
  );
}
