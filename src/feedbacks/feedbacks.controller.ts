import { Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FeedbacksService } from './feedbacks.service';
import { Public } from 'src/common/decorator/public.decorator';
import { ResponseData } from 'src/common/global/responde.data';
import { HttpMessage } from 'src/common/enum/httpstatus.enum';

@Controller('feedbacks')
@ApiTags('feedbacks')
export class FeedbacksController {
    constructor(
        private readonly feedbackService: FeedbacksService
    ) { }

    @Get(':doctorId')
    @Public()
    getAvFeedbackByDoctorId(
        @Param('doctorId', new ParseIntPipe()) doctorId: number
    ) {
        try {
            const averageRating = this.feedbackService.getAverageRatingByDoctorId(doctorId);
            return new ResponseData(averageRating, HttpStatus.OK, HttpMessage.OK);
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}